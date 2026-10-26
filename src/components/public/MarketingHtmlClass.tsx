"use client";

import { clearPublicDesktopLock } from "@/lib/public/desktop-lock";
import { GG_LAYOUT_WIDTH } from "@/lib/public/gg-layout-width";
import { useEffect } from "react";

function revealMarketingLayout(html: HTMLElement) {
  html.classList.remove("gg-desktop-boot");
  html.classList.add("gg-desktop-ready", "gg-layout-ready");
}

/** Applies Zenith `gg-public` classes on <html>/<body> for marketing routes only. */
export function MarketingHtmlClass() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("gg-public-root", "gg-desktop-lock");
    html.classList.remove("dark");
    html.style.setProperty("--gg-desktop-lock-width", `${GG_LAYOUT_WIDTH}px`);
    html.style.colorScheme = "light";
    body.classList.add("gg-public", "gg-desktop-lock");

    const onReady = () => revealMarketingLayout(html);
    html.addEventListener("gg-desktop-ready", onReady);
    if (html.classList.contains("gg-desktop-ready")) {
      onReady();
    }

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (html.classList.contains("gg-desktop-boot")) {
          revealMarketingLayout(html);
        }
      });
    });
    const timeout = window.setTimeout(onReady, 3000);

    return () => {
      html.removeEventListener("gg-desktop-ready", onReady);
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      clearPublicDesktopLock();
    };
  }, []);
  return null;
}
