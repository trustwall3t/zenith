import { revalidatePath } from "next/cache";
import { COPY_TRADING } from "@/config/copy-trading";
import { db } from "@/lib/db";
import { applySettlementPolicy, money, stake } from "@/lib/copy-trading/math";
import { livePrice } from "@/lib/market-quotes/live-price";
import { CopySubscriptionStatus } from "@/generated/prisma";
import {
  sendCopyTradeClosed,
  sendCopyTradeOpened,
} from "@/lib/email/zenith-notifications";

export async function startCopying(
  userId: string,
  traderId: number,
  allocationPct: number,
) {
  const trader = await db.trader.findFirst({
    where: { id: traderId, isActive: true },
  });
  if (!trader) throw new Error("Trader is not available.");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || (user.walletBalance ?? 0) <= 0) {
    throw new Error("You need a positive wallet balance to copy.");
  }
  if (allocationPct < 1 || allocationPct > 100) {
    throw new Error("Allocation must be between 1% and 100%.");
  }

  return db.copySubscription.upsert({
    where: { userId_traderId: { userId, traderId } },
    create: {
      userId,
      traderId,
      allocationPercentage: allocationPct,
      status: CopySubscriptionStatus.ACTIVE,
      startedAt: new Date(),
    },
    update: {
      allocationPercentage: allocationPct,
      status: CopySubscriptionStatus.ACTIVE,
      startedAt: new Date(),
    },
  });
}

export async function stopCopying(userId: string, traderId: number) {
  const sub = await db.copySubscription.findUnique({
    where: { userId_traderId: { userId, traderId } },
  });
  if (!sub) throw new Error("You are not copying this trader.");
  return db.copySubscription.update({
    where: { id: sub.id },
    data: { status: CopySubscriptionStatus.STOPPED },
  });
}

export async function placeSelfTrade(
  userId: string,
  symbol: string,
  market: string,
  direction: "up" | "down",
  durationSeconds: number,
  stakeAmount: number,
) {
  if (!(durationSeconds in COPY_TRADING.selfDurations)) {
    throw new Error("Invalid duration.");
  }
  if (stakeAmount <= 0) throw new Error("Stake must be positive.");

  const asset = await db.copyAsset.findUnique({
    where: { symbol },
  });
  if (!asset) throw new Error("Asset not supported.");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found.");
  const balance = money(Number(user.walletBalance ?? 0));
  const stakeRounded = money(stakeAmount);
  if (stakeRounded <= 0) throw new Error("Stake must be positive.");
  if (stakeRounded > balance) throw new Error("Insufficient wallet balance.");

  const entry = await livePrice(
    asset.symbol,
    asset.market,
    asset.externalId,
  );
  const openedAt = new Date();
  const expiresAt = new Date(openedAt.getTime() + durationSeconds * 1000);

  return db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { walletBalance: money(balance - stakeRounded) },
    });
    return tx.copyTrade.create({
      data: {
        userId,
        assetSymbol: asset.symbol,
        assetName: asset.name,
        market: asset.market,
        externalId: asset.externalId,
        direction,
        stake: stakeRounded,
        entryPrice: entry,
        durationSeconds,
        status: "open",
        openedAt,
        expiresAt,
      },
    });
  });
}

export async function settleDueTrades(userId?: string) {
  const now = new Date();
  const trades = await db.copyTrade.findMany({
    where: {
      status: "open",
      expiresAt: { lte: now },
      ...(userId ? { userId } : {}),
    },
    orderBy: { expiresAt: "asc" },
    take: 200,
  });

  let settled = 0;
  let failed = 0;

  for (const trade of trades) {
    try {
      const exit = await livePrice(
        trade.assetSymbol,
        trade.market,
        trade.externalId ?? undefined,
      );
      const ok = await settleOneTrade(trade.id, exit);
      if (ok) settled++;
      else failed++;
    } catch {
      failed++;
    }
  }

  if (settled > 0) {
    revalidatePath("/dashboard/trading-history");
    revalidatePath("/dashboard/copy/history");
    revalidatePath("/dashboard/live-trading");
  }

  return { settled, failed };
}

export async function settleOneTrade(tradeId: string, exitPrice: number) {
  return db.$transaction(async (tx) => {
    const trade = await tx.copyTrade.findUnique({ where: { id: tradeId } });
    if (!trade || trade.status !== "open") return false;

    const user = await tx.user.findUnique({ where: { id: trade.userId } });
    if (!user) return false;

    const stakeNum = Number(trade.stake);
    const direction = trade.direction as "up" | "down";
    const math = applySettlementPolicy(
      Number(trade.entryPrice),
      stakeNum,
      direction,
      {
        targetWinRate: COPY_TRADING.targetWinRate,
        winProfitPctMin: COPY_TRADING.winProfitPctMin,
        winProfitPctMax: COPY_TRADING.winProfitPctMax,
        lossPctMin: COPY_TRADING.lossPctMin,
        lossPctMax: COPY_TRADING.lossPctMax,
      },
    );
    const storedExit = math.exitPrice > 0 ? math.exitPrice : exitPrice;

    await tx.user.update({
      where: { id: user.id },
      data: {
        walletBalance: (user.walletBalance ?? 0) + Math.round(math.credit),
        profitBalance: (user.profitBalance ?? 0) + Math.round(math.profit),
      },
    });

    await tx.copyTrade.update({
      where: { id: trade.id },
      data: {
        exitPrice: storedExit,
        profit: math.profit,
        status: math.status,
        closedAt: new Date(),
      },
    });

    await tx.transaction.create({
      data: {
        userId: user.id,
        paymentMethod: "copy_trade",
        transactionId: trade.id,
        status: "success",
        transactionType: "trading",
        postType: "profit",
        amount: Math.round(math.profit),
        type: `Copy ${trade.assetSymbol} ${math.status}`,
        pair: trade.assetSymbol,
      },
    });

    sendCopyTradeClosed({
      to: user.email,
      symbol: trade.assetSymbol,
      status: math.status,
      profit: math.profit,
    }).catch(() => undefined);

    return true;
  });
}

function randomDuration(): number {
  const min = COPY_TRADING.minDurationSeconds;
  const list = COPY_TRADING.durations.filter((s) => s >= min);
  return list[Math.floor(Math.random() * list.length)] ?? min;
}

/** Admin emit — mirrors Zenith `CopyTrading::emit` + `mirror`. */
export async function emitTraderTrades(traderId: number) {
  const trader = await db.trader.findFirst({
    where: { id: traderId, isActive: true },
  });
  if (!trader) throw new Error("Trader not found or inactive.");

  const asset = await db.copyAsset.findFirst({
    where: { market: trader.market },
    orderBy: { id: "asc" },
  });
  if (!asset) throw new Error("No assets for this market.");

  const entry = await livePrice(asset.symbol, asset.market, asset.externalId);
  const direction = Math.random() > 0.5 ? "up" : "down";
  const durationSeconds = randomDuration();
  const openedAt = new Date();
  const expiresAt = new Date(openedAt.getTime() + durationSeconds * 1000);

  const subs = await db.copySubscription.findMany({
    where: { traderId, status: CopySubscriptionStatus.ACTIVE },
    include: { user: true },
  });

  let opened = 0;
  let skipped = 0;

  for (const sub of subs) {
    const user = sub.user;
    if (!user) {
      skipped++;
      continue;
    }
    const balance = money(user.walletBalance ?? 0);
    const stakeAmount = stake(balance, Number(sub.allocationPercentage));
    if (stakeAmount <= 0 || balance < stakeAmount) {
      skipped++;
      continue;
    }

    try {
      await db.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { walletBalance: Math.round(balance - stakeAmount) },
        });
        const trade = await tx.copyTrade.create({
          data: {
            userId: user.id,
            traderId: trader.id,
            subscriptionId: sub.id,
            traderName: trader.name,
            assetSymbol: asset.symbol,
            assetName: asset.name,
            market: asset.market,
            externalId: asset.externalId,
            direction,
            stake: stakeAmount,
            entryPrice: entry,
            durationSeconds,
            status: "open",
            openedAt,
            expiresAt,
          },
        });
        sendCopyTradeOpened({
          to: user.email,
          symbol: asset.symbol,
          direction,
          stake: stakeAmount,
        }).catch(() => undefined);
        return trade;
      });
      opened++;
    } catch {
      skipped++;
    }
  }

  return {
    opened,
    skipped,
    symbol: asset.symbol,
    direction,
    notice: subs.length === 0 ? "No active copiers." : null,
  };
}

export { stake, money };
