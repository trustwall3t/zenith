"use client";

import { resetMarketingViewportAfterSpaNav } from "@/lib/public/desktop-lock";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Marketing uses a zoom-to-fit viewport meta tag. Browsers do not reliably
 * apply a new viewport on client-side navigation — reload when leaving marketing.
 */
export function PublicDesktopLockLifecycle() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    resetMarketingViewportAfterSpaNav(pathname);
  }, [pathname]);

  return null;
}
