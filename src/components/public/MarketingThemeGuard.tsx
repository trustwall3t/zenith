"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/** Dashboard uses dark mode by default; public marketing must stay light (Zenith home.css). */
export function MarketingThemeGuard({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
