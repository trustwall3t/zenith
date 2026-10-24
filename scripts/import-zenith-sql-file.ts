/**
 * Import Zenith phpMyAdmin .sql dump → Postgres (no MySQL/Docker required).
 *
 *   npx tsx scripts/import-zenith-sql-file.ts /path/to/u228053773_phantom.sql
 */
import { execFileSync } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();
type Row = Record<string, unknown>;

function yn(v: unknown): boolean {
  if (v === true || v === 1) return true;
  const s = String(v ?? "").toLowerCase();
  return s === "on" || s === "yes" || s === "true" || s === "1";
}

function int(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function dateOrNull(v: unknown): Date | null {
  if (!v) return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

function pick(row: Row, ...names: string[]): unknown {
  for (const n of names) {
    if (row[n] !== undefined) return row[n];
  }
  return undefined;
}

async function main() {
  const dumpPath =
    process.argv[2] ||
    path.join(process.cwd(), "data/zenith-mysql.sql");

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const py = path.join(scriptDir, "extract_mysql_dump.py");

  console.log("Parsing SQL dump …");
  const json = execFileSync("python3", [py, dumpPath], {
    encoding: "utf-8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const data = JSON.parse(json) as Record<string, Row[]>;

  const userIdMap = new Map<number, string>();

  const s = data.settings?.[0];
  if (s) {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        siteName: String(s.site_name ?? "Zenith Growth"),
        currency: String(s.currency ?? "$"),
        welcomeMessage: String(s.welcome_message ?? s.site_title ?? ""),
        enableKyc: yn(s.enable_kyc),
        enable2fa: yn(s.enable_2fa),
        enableWithdrawals: yn(s.enable_with ?? "yes"),
        googleTranslate: yn(s.google_translate),
        tradeMode: yn(s.trade_mode ?? "on"),
        weekendTrade: yn(s.weekend_trade ?? "on"),
        returnCapital: yn(s.return_capital ?? true),
        contactEmail: s.contact_email ? String(s.contact_email) : null,
        siteAddress: s.site_address ? String(s.site_address) : null,
        logoUrl: s.logo ? String(s.logo) : null,
      },
      update: {
        siteName: String(s.site_name ?? "Zenith Growth"),
        currency: String(s.currency ?? "$"),
        welcomeMessage: String(s.welcome_message ?? ""),
        tradeMode: yn(s.trade_mode ?? "on"),
        weekendTrade: yn(s.weekend_trade ?? "on"),
        contactEmail: s.contact_email ? String(s.contact_email) : null,
        logoUrl: s.logo ? String(s.logo) : null,
      },
    });
    console.log("SiteSettings imported");
  }

  for (const p of data.plans ?? []) {
    const id = int(p.id);
    await prisma.investmentPlan.upsert({
      where: { id },
      create: {
        id,
        name: String(p.name ?? `Plan ${id}`),
        minPrice: int(p.min_price),
        maxPrice: int(p.max_price),
        incrementAmount: String(p.increment_amount ?? "0"),
        incrementInterval: String(p.increment_interval ?? "Monthly"),
        incrementType: String(p.increment_type ?? "Percentage"),
        planType: String(p.type ?? "Main"),
        expiration: p.expiration ? String(p.expiration) : null,
        gift: p.gift ? int(p.gift) : null,
      },
      update: {
        name: String(p.name ?? `Plan ${id}`),
        minPrice: int(p.min_price),
        maxPrice: int(p.max_price),
        incrementAmount: String(p.increment_amount ?? "0"),
        incrementInterval: String(p.increment_interval ?? "Monthly"),
      },
    });
  }
  console.log(`Investment plans: ${data.plans?.length ?? 0}`);

  for (const u of data.users ?? []) {
    const zenithId = int(u.id);
    const email = String(u.email);
    const existing =
      (await prisma.user.findFirst({ where: { zenithId } })) ??
      (await prisma.user.findUnique({ where: { email } }));

    const row = {
      zenithId,
      name: String(u.name ?? "User"),
      email,
      password: String(u.password),
      phone: String(u.phone ?? ""),
      address: String(u.address ?? ""),
      country: String(u.country ?? ""),
      AccountType: String(u.acnt_type_active ?? "Standard"),
      isVerified: yn(u.account_verify) || Boolean(u.email_verified_at),
      refcode: u.ref_link ? String(u.ref_link) : null,
      refby: u.ref_by ? String(u.ref_by) : null,
      walletBalance: int(u.account_bal),
      profitBalance: int(u.roi),
      roiTotal: int(u.roi),
      btcAddress: u.btc_address ? String(u.btc_address) : null,
      ethAddress: u.eth_address ? String(u.eth_address) : null,
      tradeMode: String(u.trade_mode ?? "on"),
      sendRoiEmail: String(u.sendroiemail ?? "Yes") !== "No",
      sendPlanClosedEmail: String(u.sendinvplanemail ?? "Yes") !== "No",
      confirm:
        u.email_verified_at || yn(u.account_verify) ? "true" : null,
    };

    if (existing) {
      userIdMap.set(zenithId, existing.id);
      await prisma.user.update({ where: { id: existing.id }, data: row });
      continue;
    }
    const id = randomUUID();
    userIdMap.set(zenithId, id);
    await prisma.user.create({ data: { id, ...row } });
  }
  console.log(`Users: ${userIdMap.size}`);

  for (const up of data.user_plans ?? []) {
    const zenithId = int(up.id);
    const userId = userIdMap.get(int(up.user));
    const planId = int(up.plan);
    if (!userId || !planId) continue;

    const statusRaw = pick(up, "active", "activate");
    const status = statusRaw != null ? String(statusRaw) : "yes";
    const profitEarned = int(pick(up, "profit_earned"), 0);

    await prisma.userInvestmentPlan.upsert({
      where: { zenithId },
      create: {
        zenithId,
        userId,
        planId,
        amount: int(up.amount),
        status,
        profitEarned,
        invDuration: up.inv_duration ? String(up.inv_duration) : null,
        activatedAt: dateOrNull(up.activated_at),
        expireDate: dateOrNull(up.expire_date),
        lastGrowth: dateOrNull(up.last_growth),
      },
      update: {
        amount: int(up.amount),
        status,
        profitEarned,
        lastGrowth: dateOrNull(up.last_growth),
        expireDate: dateOrNull(up.expire_date),
      },
    });
  }
  console.log(`User investment plans: ${data.user_plans?.length ?? 0}`);

  for (const d of (data.deposits ?? []).slice(0, 2000)) {
    const userId = userIdMap.get(int(d.user));
    if (!userId) continue;
    const txId = `zenith-dep-${d.id}`;
    if (await prisma.transaction.findFirst({ where: { transactionId: txId } }))
      continue;
    await prisma.transaction.create({
      data: {
        userId,
        paymentMethod: String(d.payment_mode ?? "deposit"),
        transactionId: txId,
        status: String(d.status ?? "pending"),
        transactionType: "deposit",
        postType: "credit",
        amount: int(d.amount),
        type: "Deposit",
      },
    });
  }

  for (const w of (data.withdrawals ?? []).slice(0, 2000)) {
    const userId = userIdMap.get(int(w.user));
    if (!userId) continue;
    const txId = `zenith-wd-${w.id}`;
    if (await prisma.transaction.findFirst({ where: { transactionId: txId } }))
      continue;
    await prisma.transaction.create({
      data: {
        userId,
        paymentMethod: String(w.payment_mode ?? "withdraw"),
        transactionId: txId,
        status: String(w.status ?? "pending"),
        transactionType: "withdraw",
        postType: "debit",
        amount: int(w.amount),
        type: "Withdrawal",
      },
    });
  }

  console.log(
    `Transactions: deposits ${data.deposits?.length ?? 0}, withdrawals ${data.withdrawals?.length ?? 0}`,
  );
  console.log("Import complete.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
