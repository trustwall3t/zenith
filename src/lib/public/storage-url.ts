/** Map Laravel `settings.logo` (`photos/file.png`) to Next static URLs. */
export function resolvePublicStorageUrl(path: string | null | undefined): string | null {
  if (!path || !String(path).trim()) return null;
  let s = String(path).trim().replace(/\\/g, "/");
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  s = s.replace(/^\/+/, "");
  if (s.startsWith("storage/")) s = s.slice("storage/".length);
  if (s.startsWith("public/")) s = s.slice("public/".length);
  if (!s.startsWith("photos/") && !s.includes("/")) {
    s = `photos/${s}`;
  }
  return `/${s}`;
}
