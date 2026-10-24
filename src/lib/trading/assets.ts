import { COPY_TRADING } from "@/config/copy-trading";
import { db } from "@/lib/db";
import { defaultIconUrl } from "@/lib/trading/asset-logos";
import { fetchQuotesForCopyAssets } from "@/lib/trading/quotes";
import type { Asset, AssetCategory } from "@/types/trading";

export function marketToCategory(market: string): AssetCategory {
  return market.toUpperCase() === "CRYPTO" ? "crypto" : "stocks";
}

export function tradingViewSymbol(symbol: string, market: string): string {
  if (market.toUpperCase() === "CRYPTO") {
    return `BINANCE:${symbol}USDT`;
  }
  return `NASDAQ:${symbol}`;
}

export async function ensureCopyAssets(): Promise<void> {
  for (const asset of COPY_TRADING.assets) {
    await db.copyAsset.upsert({
      where: { symbol: asset.symbol },
      create: {
        symbol: asset.symbol,
        name: asset.name,
        market: asset.market,
        externalId: asset.externalId,
      },
      update: {
        name: asset.name,
        market: asset.market,
        externalId: asset.externalId,
      },
    });
  }
}

function rowToAsset(
  row: {
    symbol: string;
    name: string;
    market: string;
    externalId: string;
  },
  quote?: { price: number; changePercent: number; iconUrl?: string },
): Asset {
  const category = marketToCategory(row.market);
  return {
    symbol: row.symbol,
    name: row.name,
    market: row.market,
    category,
    iconUrl: quote?.iconUrl ?? defaultIconUrl(row.symbol, row.market),
    tradingViewSymbol: tradingViewSymbol(row.symbol, row.market),
    price: quote?.price ?? 0,
    changePercent: quote?.changePercent ?? 0,
  };
}

export async function loadTradingAssetsWithPrices(): Promise<Asset[]> {
  let rows = await db.copyAsset.findMany({ orderBy: { symbol: "asc" } });
  if (rows.length === 0) {
    await ensureCopyAssets();
    rows = await db.copyAsset.findMany({ orderBy: { symbol: "asc" } });
  }

  const quoteMap = await fetchQuotesForCopyAssets(rows);

  return rows.map((row) => rowToAsset(row, quoteMap.get(row.symbol)));
}

export async function refreshAssetPrices(): Promise<
  Array<{
    symbol: string;
    price: number;
    changePercent: number;
    iconUrl?: string;
  }>
> {
  const rows = await db.copyAsset.findMany({ orderBy: { symbol: "asc" } });
  const quoteMap = await fetchQuotesForCopyAssets(rows);

  return rows.map((row) => {
    const q = quoteMap.get(row.symbol);
    return {
      symbol: row.symbol,
      price: q?.price ?? 0,
      changePercent: q?.changePercent ?? 0,
      iconUrl: q?.iconUrl,
    };
  });
}
