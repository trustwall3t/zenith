const PAGE_LANG = "en";

function cookieDomainVariants(): string[] {
  if (typeof window === "undefined") return [""];
  const host = window.location.hostname;
  if (host === "localhost" || host.endsWith(".local")) return [""];
  const parts = host.replace(/^www\./, "").split(".");
  if (parts.length < 2) return [""];
  const root = parts.slice(-2).join(".");
  return ["", `.${root}`];
}

function writeGoogTransCookie(value: string) {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  for (const domain of cookieDomainVariants()) {
    const domainPart = domain ? `;domain=${domain}` : "";
    if (!value) {
      document.cookie = `googtrans=;path=/${domainPart};expires=${expires}`;
    } else {
      document.cookie = `googtrans=${encodeURIComponent(value)};path=/;max-age=31536000;SameSite=Lax${domainPart}`;
    }
  }
}

/** Read active target language from Google Translate cookie. */
export function readActiveTranslateLanguage(): string {
  if (typeof document === "undefined") return PAGE_LANG;
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match?.[1]) return PAGE_LANG;
  const raw = decodeURIComponent(match[1].trim());
  const segments = raw.split("/").filter(Boolean);
  const target = segments[segments.length - 1];
  return target || PAGE_LANG;
}

/** Apply translation via Google cookie + reload (reliable across marketing & app chrome). */
export function applyTranslateLanguage(targetCode: string) {
  if (typeof window === "undefined") return;
  if (!targetCode || targetCode === PAGE_LANG) {
    writeGoogTransCookie("");
  } else {
    writeGoogTransCookie(`/${PAGE_LANG}/${targetCode}`);
  }
  window.location.reload();
}
