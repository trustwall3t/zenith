# Database for apextradezone-zenith

Use a **separate** database from **apextradezone**. Never point this app at apextradezone’s Supabase.

## Option A — Supabase (production / Vercel)

1. [supabase.com](https://supabase.com) → **New project** (e.g. `apextradezone-zenith`).
2. Wait until the project is healthy.
3. **Project Settings → Database → Connection string**
   - **DATABASE_URL** — **Transaction pooler** (IPv4), mode *Transaction*, port **6543**, append `?pgbouncer=true` if Prisma docs require it for your region.
   - **DIRECT_URL** — **Direct connection** or **Session pooler** (for migrations / `db push`), port **5432** or **5432** direct host.
4. In `apextradezone-zenith/.env`:

```env
DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-....pooler.supabase.com:5432/postgres"
ALLOW_ZENITH_DB_PUSH=1
```

5. Apply schema:

```bash
cd /Users/user/Desktop/2025/investment/apextradezone-zenith
ALLOW_ZENITH_DB_PUSH=1 npm run db:push
npx tsx prisma/seed-zenith.ts   # optional demo data
```

6. On **Vercel**, set the same `DATABASE_URL`, `DIRECT_URL`, and `CRON_SECRET` for the zenith deployment only.

## Option B — Local Docker (dev / MySQL import testing)

```bash
cd /Users/user/Desktop/2025/investment/apextradezone-zenith
npm run db:up
```

Add to `.env`:

```env
DATABASE_URL="postgresql://zenith:zenith_local_dev@127.0.0.1:5433/zenith"
DIRECT_URL="postgresql://zenith:zenith_local_dev@127.0.0.1:5433/zenith"
ALLOW_ZENITH_DB_PUSH=1
```

Then:

```bash
ALLOW_ZENITH_DB_PUSH=1 npm run db:push
npm run db:seed-zenith
```

## After the DB exists

- **Zenith MySQL import:** start `greengrowth-mysql` (zenithgrowth `docker compose`), then `npm run import:zenith-mysql`.
- **Cron / ROI:** `curl http://localhost:3000/api/cron/run-all` (dev allows without `CRON_SECRET`).

When your Supabase URLs are in `.env`, say **“db is ready”** and we can run push, seed, and import together.
