"use client";

import {
  applyTranslateLanguage,
  readActiveTranslateLanguage,
} from "@/lib/public/google-translate-cookie";
import {
  TRANSLATE_LANGUAGES,
  languageByCode,
} from "@/lib/public/translate-languages";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Globe, Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type LanguageSelectorProps = {
  variant?: "marketing" | "app";
  className?: string;
};

const MENU_WIDTH = 280;

function computeMenuStyle(trigger: HTMLElement): React.CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const left = Math.min(
    Math.max(8, rect.right - MENU_WIDTH),
    window.innerWidth - MENU_WIDTH - 8,
  );
  return {
    top: rect.bottom + 8,
    left,
    width: MENU_WIDTH,
  };
}

export function LanguageSelector({
  variant = "app",
  className,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("en");
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerId = useId();

  useEffect(() => {
    setValue(readActiveTranslateLanguage());
  }, []);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    setMenuStyle(computeMenuStyle(el));
  }, []);

  const openMenu = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    setMenuStyle(computeMenuStyle(el));
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setQuery("");
    setMenuStyle(null);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    searchRef.current?.focus({ preventScroll: true });
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onLayout = () => updatePosition();
    window.addEventListener("scroll", onLayout, true);
    window.addEventListener("resize", onLayout);
    return () => {
      window.removeEventListener("scroll", onLayout, true);
      window.removeEventListener("resize", onLayout);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  const filtered = TRANSLATE_LANGUAGES.filter((lang) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      lang.label.toLowerCase().includes(q) ||
      lang.native.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const current = languageByCode(value) ?? TRANSLATE_LANGUAGES[0]!;

  const triggerClass = cn(
    "gg-language-trigger",
    variant === "marketing" && "gg-language-trigger--marketing",
    open && "gg-language-trigger--open",
    className,
  );

  const menu =
    open && menuStyle && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            className="gg-language-menu"
            style={menuStyle}
            role="listbox"
            aria-labelledby={triggerId}
          >
            <div className="gg-language-menu-head">
              <Search className="h-4 w-4 shrink-0 opacity-45" aria-hidden />
              <input
                ref={searchRef}
                type="search"
                className="gg-language-menu-search"
                placeholder="Search languages…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Filter languages"
              />
            </div>
            <ul className="gg-language-menu-list">
              {filtered.length === 0 ? (
                <li className="gg-language-menu-empty">No matches</li>
              ) : (
                filtered.map((lang) => (
                  <li key={lang.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang.code === value}
                      className={cn(
                        "gg-language-menu-item",
                        lang.code === value && "is-active",
                      )}
                      onClick={() => {
                        closeMenu();
                        if (lang.code === value) return;
                        setValue(lang.code);
                        applyTranslateLanguage(lang.code);
                      }}
                    >
                      <span className="gg-language-menu-text">
                        <span className="gg-language-menu-native">
                          {lang.native}
                        </span>
                        <span className="gg-language-menu-en">{lang.label}</span>
                      </span>
                      {lang.code === value ? (
                        <Check className="h-4 w-4 shrink-0 opacity-80" />
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className={triggerClass}
        onClick={() => {
          if (open) closeMenu();
          else openMenu();
        }}
      >
        <Globe className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2} />
        <span className="gg-language-trigger-label" suppressHydrationWarning>
          {current.native}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-55 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {menu}
    </>
  );
}
