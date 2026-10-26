export type TranslateLanguage = {
  code: string;
  label: string;
  native: string;
};

/** Google Translate `googtrans=/en/{code}` targets (page source: English). */
export const TRANSLATE_LANGUAGES: TranslateLanguage[] = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "zh-CN", label: "Chinese (Simplified)", native: "简体中文" },
  { code: "zh-TW", label: "Chinese (Traditional)", native: "繁體中文" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt" },
  { code: "pl", label: "Polish", native: "Polski" },
  { code: "nl", label: "Dutch", native: "Nederlands" },
  { code: "sv", label: "Swedish", native: "Svenska" },
  { code: "da", label: "Danish", native: "Dansk" },
  { code: "fi", label: "Finnish", native: "Suomi" },
  { code: "nb", label: "Norwegian", native: "Norsk" },
  { code: "he", label: "Hebrew", native: "עברית" },
  { code: "th", label: "Thai", native: "ไทย" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", label: "Malay", native: "Bahasa Melayu" },
  { code: "uk", label: "Ukrainian", native: "Українська" },
  { code: "ro", label: "Romanian", native: "Română" },
  { code: "cs", label: "Czech", native: "Čeština" },
  { code: "hu", label: "Hungarian", native: "Magyar" },
  { code: "el", label: "Greek", native: "Ελληνικά" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
];

export function languageByCode(code: string): TranslateLanguage | undefined {
  return TRANSLATE_LANGUAGES.find((l) => l.code === code);
}
