"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import { emitTraderTrades } from "@/lib/copy-trading/service";
import { db } from "@/lib/db";

const COPY_TRADERS_PATH = "/admin/dashboard/copy-traders";

async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export type AdminTraderRow = {
  id: number;
  name: string;
  market: string;
  description: string | null;
  strategy: string | null;
  winRate: number | null;
  followers: number;
  totalTrades: number;
  isActive: boolean;
  activeCopiers: number;
};

export async function emitCopyTradeAdmin(traderId: number) {
  await requireAdmin();
  const result = await emitTraderTrades(traderId);
  revalidatePath(COPY_TRADERS_PATH);
  return result;
}

export async function createCopyTraderAdmin(input: {
  name: string;
  market: string;
  description?: string;
  strategy?: string;
  winRate?: number;
  followers?: number;
  totalTrades?: number;
  isActive?: boolean;
}) {
  await requireAdmin();

  const name = input.name.trim();
  if (!name) throw new Error("Trader name is required.");
  const market = input.market.trim().toUpperCase();
  if (market !== "CRYPTO" && market !== "STOCK") {
    throw new Error("Market must be CRYPTO or STOCK.");
  }

  const existing = await db.trader.findFirst({ where: { name } });
  if (existing) throw new Error("A trader with this name already exists.");

  const assetCount = await db.copyAsset.count({ where: { market } });
  if (assetCount === 0) {
    throw new Error(
      `No copy assets for ${market}. Run db seed (npm run db:seed-zenith).`,
    );
  }

  await db.trader.create({
    data: {
      name,
      market,
      description: input.description?.trim() || null,
      strategy: input.strategy?.trim() || null,
      winRate: input.winRate ?? null,
      followers: input.followers ?? 0,
      totalTrades: input.totalTrades ?? 0,
      isActive: input.isActive ?? true,
    },
  });

  revalidatePath(COPY_TRADERS_PATH);
  return { ok: true as const };
}

export async function setCopyTraderActiveAdmin(
  traderId: number,
  isActive: boolean,
) {
  await requireAdmin();
  await db.trader.update({
    where: { id: traderId },
    data: { isActive },
  });
  revalidatePath(COPY_TRADERS_PATH);
  return { ok: true as const };
}
