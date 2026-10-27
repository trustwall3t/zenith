# Apex Trade Zone — Zenith seamless migration

Product folder: **`apextradezone-zenith`** (Next.js + Prisma + Supabase Postgres).

## What is wired (parity with Zenith Laravel)

| Feature | Zenith | apextradezone-zenith |
|--------|--------|----------------------|
| Investment plans (DB) | `plans` | `InvestmentPlan` + `/dashboard/plans` |
| Join plan from wallet | Livewire / controllers | `POST /api/investment/join` + **Join plan** UI |
| Automatic ROI | `AutoTaskController::automaticRoi` | `runAutomaticRoi()` in `src/lib/investment/roi-cron.ts` |
| Copy subscribe / self-trade | `CopyTrading` | `src/lib/copy-trading/service.ts` |
| Copy settlement cron | `copy:settle` every minute | `settleDueTrades()` |
| Admin emit trades | Admin copy UI | `/admin/dashboard/copy-traders` + `POST /api/admin/copy/emit` |
| ROI / plan / copy emails | Mailables | `src/lib/email/zenith-notifications.ts` |
| MySQL → Postgres | — | `npm run import:zenith-mysql` |

## One-time setup

```bash
cd /Users/user/Desktop/2025/investment/apextradezone-zenith
cp .env.example .env
# Use a **dedicated** Supabase (or local Postgres) — never apextradezone’s DATABASE_URL
npm install
ALLOW_ZENITH_DB_PUSH=1 npm run db:push   # only after DATABASE_URL points at the Zenith DB
npx prisma generate
npx tsx prisma/seed-zenith.ts   # optional if importing full MySQL
npm run dev
```

## Import Zenith MySQL → Supabase

1. Start Zenith MySQL (Docker or remote).
2. Ensure Postgres schema is pushed (`npx prisma db push`).
3. Run:

```bash
export ZENITH_MYSQL_HOST=127.0.0.1
export ZENITH_MYSQL_USER=root
export ZENITH_MYSQL_PASSWORD=your_password
export ZENITH_MYSQL_DATABASE=u228053773_phantom
npm run import:zenith-mysql
```

Imports: `settings`, `plans`, `users` (keeps Laravel password hashes + `zenithId`), `user_plans` (ROI state), copy tables if present, recent deposits/withdrawals as `Transaction`.

Re-running the script is safe: users match by `zenithId` or email; transactions dedupe by `zenith-dep-*` / `zenith-wd-*`.

## Production cron (Vercel)

`vercel.json` hits **`GET /api/cron/run-all`** once daily at **00:00 UTC** (`0 0 * * *`) — suited to Vercel Hobby (one cron job). ROI logic catches up missed payout intervals on each run.

- Set **`CRON_SECRET`** in Vercel env. Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically.
- Locally, without `CRON_SECRET`, dev mode allows the route for testing:

```bash
curl -s http://localhost:3000/api/cron/run-all | jq
```

Response includes `{ copy: {...}, roi: { credited, skipped, expired, weekendSkipped } }`.

## User-facing routes

- `/dashboard/plans` — join with wallet balance  
- `/dashboard/copy`, `/dashboard/copy/history`  
- `/dashboard/trade` — self-trade  

## Admin

- `/admin/dashboard/copy-traders` — emit signals to active copiers  

## Public marketing (Zenith Aurex)

Wired in-app: `(marketing)` route group, `public/main` assets, `/api/public/home`, same URLs as Laravel (`/about`, `/forex`, …). Auth CTAs → `/auth/login` and `/auth/signup`. Refresh assets: `npm run sync:zenith-public`.

## Still optional / not ported
- Payment gateways (Paystack, Flutterwave, Stripe webhooks)  
- Full admin plan CRUD (seed + import cover most cases)  

## Cutover checklist

1. Import MySQL → Postgres and spot-check balances + active `user_plans`.  
2. Deploy with `CRON_SECRET`, SMTP, `DATABASE_URL`.  
3. Run one manual cron curl on production and confirm ROI/credits in logs.  
4. Point DNS to Vercel; freeze Laravel cron once verified.  
