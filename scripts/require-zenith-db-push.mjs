/**
 * Blocks `prisma db push` unless you explicitly opt in.
 * Prevents pushing Zenith schema to apextradezone’s production Supabase by mistake.
 */
if (process.env.ALLOW_ZENITH_DB_PUSH !== "1") {
  console.error(`
Refusing to run prisma db push.

apextradezone-zenith must use its own DATABASE_URL (not apextradezone’s Supabase).

When your .env points at the correct Zenith database only, run:

  ALLOW_ZENITH_DB_PUSH=1 npm run db:push
`);
  process.exit(1);
}
