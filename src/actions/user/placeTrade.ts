"use server";

import { revalidatePath } from "next/cache";
import { placeSelfTrade } from "@/lib/copy-trading/service";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Trade } from "@/types/trading";

interface PlaceTradeResult {
  error?: string;
  tradeId?: string;
  balance?: number;
  trade?: Trade;
}

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

export async function placeTrade(formData: FormData): Promise<PlaceTradeResult> {
  const session = await getSession();
  if (!session) {
    return { error: "You must be logged in to trade." };
  }

  const assetSymbol = formData.get("assetSymbol");
  const direction = formData.get("direction");
  const stake = Number(formData.get("stake"));
  const durationSeconds = Number(formData.get("durationSeconds"));

  if (typeof assetSymbol !== "string" || !assetSymbol) {
    return { error: "Missing asset." };
  }
  if (direction !== "up" && direction !== "down") {
    return { error: "Invalid trade direction." };
  }
  if (!Number.isFinite(stake) || stake <= 0) {
    return { error: "Enter a valid stake amount." };
  }
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return { error: "Invalid duration." };
  }

  const asset = await db.copyAsset.findUnique({ where: { symbol: assetSymbol } });
  if (!asset) {
    return { error: "Unknown asset." };
  }

  try {
    const created = await placeSelfTrade(
      session.userId,
      asset.symbol,
      asset.market,
      direction,
      durationSeconds,
      stake,
    );

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { walletBalance: true },
    });

    revalidatePath("/dashboard/trading-history");
    revalidatePath("/dashboard/copy/history");
    revalidatePath("/dashboard/live-trading");

    return {
      tradeId: created.id,
      balance: Number(user?.walletBalance ?? 0),
      trade: serializeTrade(created),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Trade failed.";
    return { error: message };
  }
}
