"use client";

import Script from "next/script";

const GOOGLE_TRANSLATE_SDK =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

/** Hidden Google engine — UI is our LanguageSelector. */
export function GoogleTranslateEngine() {
  return (
    <>
      <div
        id="google_translate_element"
        className="gg-google-translate-host"
        aria-hidden
      />
      <Script src="/main/js/gg-google-translate-init.js" strategy="beforeInteractive" />
      <Script src={GOOGLE_TRANSLATE_SDK} strategy="afterInteractive" />
    </>
  );
}
