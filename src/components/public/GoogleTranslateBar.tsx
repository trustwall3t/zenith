"use client";

import Script from "next/script";

export function GoogleTranslateBar() {
  return (
    <>
      <div className="gg-public-translate-bar" aria-label="Translate page">
        <div id="google_translate_element" />
      </div>
      <Script src="/main/js/gg-public-translate.js" strategy="afterInteractive" />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
