import Script from "next/script";

/** Keeps viewport scale in sync on rotate/resize (bootstrap runs from root layout <head>). */
export function DesktopViewport() {
  return (
    <Script src="/main/js/gg-desktop-viewport-fit.js" strategy="beforeInteractive" />
  );
}
