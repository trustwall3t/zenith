import type { ReactNode } from "react";

/** Marketing stays light via root layout ThemeProvider; this is a stable wrapper only. */
export function MarketingThemeGuard({ children }: { children: ReactNode }) {
  return children;
}
