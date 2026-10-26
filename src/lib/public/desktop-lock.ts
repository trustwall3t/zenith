import { isPublicMarketingRoute } from "@/lib/public/marketing-routes";

/** Zenith public marketing: fixed 1200px layout scaled via viewport meta. */

export const PUBLIC_DESKTOP_HTML_CLASSES = [
  "gg-public-root",
  "gg-desktop-lock",
  "gg-desktop-boot",
  "gg-desktop-ready",
] as const;

export const PUBLIC_DESKTOP_BODY_CLASSES = ["gg-public", "gg-desktop-lock"] as const;

const DEFAULT_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover";

declare global {
  interface Window {
    /** Set by `/main/js/gg-desktop-viewport-fit.js` on marketing pages. */
    __ggTeardownDesktopViewport?: () => void;
  }
}

export function hasPublicDesktopViewportMeta(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.querySelector('meta[name="viewport"][data-gg-fit]'),
  );
}

/** Remove marketing desktop-lock side effects (viewport meta, html/body classes). */
export function clearPublicDesktopLock() {
  if (typeof document === "undefined") return;

  window.__ggTeardownDesktopViewport?.();

  const html = document.documentElement;
  const body = document.body;

  for (const cls of PUBLIC_DESKTOP_HTML_CLASSES) {
    html.classList.remove(cls);
  }
  for (const cls of PUBLIC_DESKTOP_BODY_CLASSES) {
    body.classList.remove(cls);
  }

  html.style.removeProperty("--gg-desktop-lock-width");
  html.style.removeProperty("--gg-viewport-h");
  if (!html.classList.contains("dark")) {
    html.style.colorScheme = "";
  }

  document
    .querySelectorAll('meta[name="viewport"][data-gg-fit]')
    .forEach((node) => node.remove());

  let viewport = document.querySelector(
    'meta[name="viewport"]:not([data-gg-fit])',
  ) as HTMLMetaElement | null;

  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.name = "viewport";
    document.head.appendChild(viewport);
  }

  viewport.content = DEFAULT_VIEWPORT;
}

/**
 * Mobile browsers often ignore viewport meta changes during client-side routing.
 * If marketing viewport was active, reload once on the target URL.
 */
export function resetMarketingViewportAfterSpaNav(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  if (isPublicMarketingRoute(pathname)) return false;

  const hadMarketingViewport = hasPublicDesktopViewportMeta();
  clearPublicDesktopLock();

  if (!hadMarketingViewport) return false;

  window.location.reload();
  return true;
}
