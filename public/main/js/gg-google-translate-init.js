/**
 * Boots hidden Google Translate (cookie-driven). Visible UI: LanguageSelector component.
 */
window.googleTranslateElementInit = function googleTranslateElementInit() {
  var host = document.getElementById("google_translate_element");
  if (!host || !window.google || !google.translate || !google.translate.TranslateElement) {
    return;
  }

  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      autoDisplay: false,
    },
    "google_translate_element",
  );

  document.documentElement.dispatchEvent(new CustomEvent("gg-translate-ready"));
};
