/**
 * One-time (or repeatable) import: Zenith Aurex MySQL → apextradezone-zenith Postgres.
 *
 * Usage:
 *   ZENITH_MYSQL_HOST=127.0.0.1 ZENITH_MYSQL_USER=root ZENITH_MYSQL_PASSWORD=... \
 *   ZENITH_MYSQL_DATABASE=u228053773_phantom npx tsx scripts/import-zenith-mysql.ts
 */
import mysql, { type Connection, type RowDataPacket } from "mysql2/promise";
import { randomUUID } from "crypto";
import { PrismaClient } from "../src/generated/prisma";
import { resolvePublicStorageUrl } from "../src/lib/public/storage-url";

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

async function tableExists(conn: Connection, name: string): Promise<boolean> {
  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1",
    [name],
  );
  return rows.length > 0;
}

async function columnSet(conn: Connection, table: string): Promise<Set<string>> {
  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ?",
    [table],
  );
  return new Set(rows.map((r) => String(r.column_name ?? r.COLUMN_NAME)));
}

function pick(row: Row, cols: Set<string>, ...names: string[]): unknown {
  for (const n of names) {
    if (cols.has(n) && row[n] !== undefined) return row[n];
  }
  return undefined;
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.ZENITH_MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.ZENITH_MYSQL_PORT || 3306),
    user: process.env.ZENITH_MYSQL_USER || "root",
    password: process.env.ZENITH_MYSQL_PASSWORD || "",
    database: process.env.ZENITH_MYSQL_DATABASE || "u228053773_phantom",
  });

  console.log("Connected to Zenith MySQL");

  const userIdMap = new Map<number, string>();

  // —— Settings ——
  const [settingsRows] = await conn.query<Row[]>(
    "SELECT * FROM settings WHERE id = 1 LIMIT 1",
  );
  const s = settingsRows[0];
  if (s) {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        siteName: String(s.site_name ?? "Zenith Aurex"),
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
        logoUrl: resolvePublicStorageUrl(s.logo ? String(s.logo) : null),
      },
      update: {
        siteName: String(s.site_name ?? "Zenith Aurex"),
        currency: String(s.currency ?? "$"),
        welcomeMessage: String(s.welcome_message ?? ""),
        tradeMode: yn(s.trade_mode ?? "on"),
        weekendTrade: yn(s.weekend_trade ?? "on"),
        logoUrl: resolvePublicStorageUrl(s.logo ? String(s.logo) : null),
        contactEmail: s.contact_email ? String(s.contact_email) : null,
        googleTranslate: yn(s.google_translate),
      },
    });
    console.log("SiteSettings imported");
  }

  // —— Plans ——
  const [plans] = await conn.query<Row[]>("SELECT * FROM plans ORDER BY id");
  for (const p of plans) {
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
  console.log(`Investment plans: ${plans.length}`);

  // —— Users ——
  const [users] = await conn.query<Row[]>("SELECT * FROM users ORDER BY id");
  for (const u of users) {
    const zenithId = int(u.id);
    const email = String(u.email);
    const existing =
      (await prisma.user.findFirst({ where: { zenithId } })) ??
      (await prisma.user.findUnique({ where: { email } }));

    const data = {
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
      await prisma.user.update({ where: { id: existing.id }, data });
      continue;
    }

    const id = randomUUID();
    userIdMap.set(zenithId, id);
    await prisma.user.create({ data: { id, ...data } });
  }
  console.log(`Users mapped: ${userIdMap.size}`);

  // —— User plans (ROI) ——
  const upCols = await columnSet(conn, "user_plans");
  const [userPlans] = await conn.query<Row[]>(
    "SELECT * FROM user_plans ORDER BY id",
  );
  for (const up of userPlans) {
    const zenithId = int(up.id);
    const userId = userIdMap.get(int(up.user));
    const planId = int(up.plan);
    if (!userId || !planId) continue;

    const statusRaw = pick(up, upCols, "active", "activate");
    const status = statusRaw != null ? String(statusRaw) : "yes";
    const profitEarned = int(pick(up, upCols, "profit_earned"), 0);

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
  console.log(`User investment plans: ${userPlans.length}`);

  // —— Copy trading ——
  if (await tableExists(conn, "copy_assets")) {
    const [assets] = await conn.query<Row[]>("SELECT * FROM copy_assets");
    for (const a of assets) {
      await prisma.copyAsset.upsert({
        where: { symbol: String(a.symbol) },
        create: {
          symbol: String(a.symbol),
          name: String(a.name),
          market: String(a.market),
          externalId: String(a.external_id),
        },
        update: {
          name: String(a.name),
          market: String(a.market),
          externalId: String(a.external_id),
        },
      });
    }
    console.log(`Copy assets: ${assets.length}`);
  } else {
    console.log("Skip copy_assets (table missing)");
  }

  if (await tableExists(conn, "traders")) {
    const [traders] = await conn.query<Row[]>("SELECT * FROM traders");
    for (const t of traders) {
      const id = int(t.id);
      await prisma.trader.upsert({
        where: { id },
        create: {
          id,
          name: String(t.name),
          description: t.description ? String(t.description) : null,
          strategy: t.strategy ? String(t.strategy) : null,
          market: String(t.market),
          winRate: t.win_rate != null ? String(t.win_rate) : null,
          followers: int(t.followers),
          totalTrades: int(t.total_trades),
          isActive: yn(t.is_active ?? true),
        },
        update: {
          name: String(t.name),
          isActive: yn(t.is_active ?? true),
        },
      });
    }
    console.log(`Traders: ${traders.length}`);

    if (await tableExists(conn, "copy_subscriptions")) {
      const [subs] = await conn.query<Row[]>(
        "SELECT * FROM copy_subscriptions",
      );
      for (const sub of subs) {
        const id = int(sub.id);
        const userId = userIdMap.get(int(sub.user_id));
        if (!userId) continue;
        const status =
          String(sub.status).toUpperCase() === "ACTIVE"
            ? "ACTIVE"
            : String(sub.status).toUpperCase() === "PAUSED"
              ? "PAUSED"
              : "STOPPED";
        await prisma.copySubscription.upsert({
          where: { id },
          create: {
            id,
            userId,
            traderId: int(sub.trader_id),
            allocationPercentage: String(sub.allocation_percentage),
            status: status as "ACTIVE" | "PAUSED" | "STOPPED",
            startedAt: dateOrNull(sub.started_at),
          },
          update: {
            allocationPercentage: String(sub.allocation_percentage),
            status: status as "ACTIVE" | "PAUSED" | "STOPPED",
          },
        });
      }
      console.log(`Copy subscriptions: ${subs.length}`);
    }

    if (await tableExists(conn, "copy_trades")) {
      const [trades] = await conn.query<Row[]>(
        "SELECT * FROM copy_trades ORDER BY id LIMIT 5000",
      );
      for (const tr of trades) {
        const userId = userIdMap.get(int(tr.user_id));
        if (!userId) continue;
        const zenithTradeId = String(tr.id);
        const exists = await prisma.copyTrade.findFirst({
          where: { id: `zenith-${zenithTradeId}` },
        });
        if (exists) continue;

        await prisma.copyTrade.create({
          data: {
            id: `zenith-${zenithTradeId}`,
            userId,
            traderId: tr.trader_id ? int(tr.trader_id) : null,
            subscriptionId: tr.subscription_id ? int(tr.subscription_id) : null,
            traderName: tr.trader_name ? String(tr.trader_name) : null,
            assetSymbol: String(tr.asset_symbol),
            assetName: String(tr.asset_name),
            market: String(tr.market),
            externalId: tr.external_id ? String(tr.external_id) : null,
            direction: String(tr.direction),
            stake: String(tr.stake),
            entryPrice: String(tr.entry_price),
            exitPrice: tr.exit_price != null ? String(tr.exit_price) : null,
            profit: tr.profit != null ? String(tr.profit) : null,
            status: String(tr.status ?? "open"),
            durationSeconds: int(tr.duration_seconds, 900),
            openedAt: dateOrNull(tr.opened_at),
            expiresAt: dateOrNull(tr.expires_at),
            closedAt: dateOrNull(tr.closed_at),
          },
        });
      }
      console.log(`Copy trades imported (up to ${trades.length})`);
    }
  } else {
    console.log("Skip traders / copy subscriptions / trades");
  }

  // —— Deposits / withdrawals → Transaction ——
  const [deposits] = await conn.query<Row[]>(
    "SELECT * FROM deposits ORDER BY id DESC LIMIT 2000",
  );
  for (const d of deposits) {
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

  const [withdrawals] = await conn.query<Row[]>(
    "SELECT * FROM withdrawals ORDER BY id DESC LIMIT 2000",
  );
  for (const w of withdrawals) {
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

  console.log("Import complete.");
  await conn.end();
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
