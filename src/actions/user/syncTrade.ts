"use server";

import { settleDueTrades } from "@/lib/copy-trading/service";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Trade } from "@/types/trading";

export interface TradingData {
  balance: number;
  openTrades: Trade[];
  history: Trade[];
}

type SyncResult = TradingData | { error: string };

function serializeTrade(trade: {
  id: string;
  assetSymbol: string;
  assetName: string;
  direction: string;
  stake: unknown;
  durationSeconds: number;
  entryPrice: unknown;
  exitPrice: unknown;
  profit: unknown;
  status: string;
  openedAt: Date | null;
  expiresAt: Date | null;
  closedAt: Date | null;
}): Trade {
  return {
    id: trade.id,
    assetSymbol: trade.assetSymbol,
    assetName: trade.assetName,
    direction: trade.direction as Trade["direction"],
    stake: Number(trade.stake),
    durationSeconds: trade.durationSeconds,
    entryPrice: Number(trade.entryPrice),
    exitPrice: trade.exitPrice != null ? Number(trade.exitPrice) : null,
    profit: trade.profit != null ? Number(trade.profit) : null,
    status: trade.status as Trade["status"],
    openedAt: (trade.openedAt ?? new Date()).toISOString(),
    expiresAt: (trade.expiresAt ?? new Date()).toISOString(),
    closedAt: trade.closedAt ? trade.closedAt.toISOString() : null,
  };
}

const selfTradeWhere = { traderId: null as null };

export async function syncTrades(userId?: string): Promise<SyncResult> {
  let resolvedUserId = userId;

  if (!resolvedUserId) {
    const session = await getSession();
    if (!session) {
      return { error: "Not authenticated." };
    }
    resolvedUserId = session.userId;
  }

  await settleDueTrades(resolvedUserId);

  const [user, openTrades, history] = await Promise.all([
    db.user.findUnique({
      where: { id: resolvedUserId },
      select: { walletBalance: true },
    }),
    db.copyTrade.findMany({
      where: { userId: resolvedUserId, ...selfTradeWhere, status: "open" },
      orderBy: { openedAt: "desc" },
    }),
    db.copyTrade.findMany({
      where: {
        userId: resolvedUserId,
        ...selfTradeWhere,
        status: { in: ["won", "lost", "even"] },
      },
      orderBy: { closedAt: "desc" },
      take: 50,
    }),
  ]);

  return {
    balance: Number(user?.walletBalance ?? 0),
    openTrades: openTrades.map(serializeTrade),
    history: history.map(serializeTrade),
  };
}
