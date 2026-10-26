/** Whether the Google Translate widget should render (env overrides DB). */
export function resolveGoogleTranslateEnabled(dbFlag: boolean): boolean {
  const env = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE?.trim().toLowerCase();
  if (env === "false" || env === "0" || env === "off") return false;
  if (env === "true" || env === "1" || env === "on") return true;
  // On by default site-wide; DB flag or admin toggle can disable.
  return dbFlag !== false;
}
