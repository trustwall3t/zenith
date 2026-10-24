import { isPublicSlug } from "@/content/public-slugs";

/** Routes that use `(marketing)` layout + `/main/css/home.css` (not legacy `/assets`). */
export function isPublicMarketingRoute(pathname: string): boolean {
  if (pathname === "/" || pathname === "/verify") return true;
  const slug = pathname.replace(/^\//, "").split("/")[0] ?? "";
  return isPublicSlug(slug);
}

/** Member/admin sign-in flows — must not use marketing desktop viewport lock. */
export function isAuthRoute(pathname: string): boolean {
  if (pathname.startsWith("/auth")) return true;
  return (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password")
  );
}
