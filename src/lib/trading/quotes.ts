import { livePrice } from "@/lib/market-quotes/live-price";
import {
  fetchCryptoFromBinance,
  fetchCryptosMarkets,
  fetchStockQuote,
} from "@/lib/market/fetch-quotes";

export interface AssetQuote {
  price: number;
  changePercent: number;
  iconUrl?: string;
}

export async function fetchQuotesForCopyAssets(
  rows: Array<{
    symbol: string;
    name: string;
    market: string;
    externalId: string;
  }>,
): Promise<Map<string, AssetQuote>> {
  const out = new Map<string, AssetQuote>();

  const cryptoRows = rows.filter((r) => r.market.toUpperCase() === "CRYPTO");
  const stockRows = rows.filter((r) => r.market.toUpperCase() !== "CRYPTO");

  if (cryptoRows.length > 0) {
    try {
      const markets = await fetchCryptosMarkets(
        cryptoRows.map((r) => r.externalId),
      );
      const byExternalId = new Map(markets.map((m) => [m.id, m]));
      const bySymbol = new Map(markets.map((m) => [m.symbol.toUpperCase(), m]));

      for (const row of cryptoRows) {
        const hit =
          byExternalId.get(row.externalId) ??
          bySymbol.get(row.symbol.toUpperCase());
        if (hit && hit.price > 0) {
          out.set(row.symbol, {
            price: hit.price,
            changePercent: hit.changePercent,
            iconUrl: hit.image,
          });
        }
      }
    } catch (err) {
      console.error("Batch crypto quotes failed:", err);
    }

    const binanceSettled = await Promise.allSettled(
      cryptoRows
        .filter((row) => !out.has(row.symbol))
        .map(async (row) => {
          const binance = await fetchCryptoFromBinance(row.symbol);
          return { row, binance };
        }),
    );
    for (const result of binanceSettled) {
      if (result.status !== "fulfilled" || !result.value.binance) continue;
      const { row, binance } = result.value;
      out.set(row.symbol, {
        price: binance.price,
        changePercent: binance.changePercent,
      });
    }
  }

  if (stockRows.length > 0) {
    const settled = await Promise.allSettled(
      stockRows.map((row) => fetchStockQuote(row.symbol, row.name)),
    );
    settled.forEach((result, i) => {
      if (result.status !== "fulfilled") return;
      const row = stockRows[i];
      const hit = result.value;
      if (hit.price > 0) {
        out.set(row.symbol, {
          price: hit.price,
          changePercent: hit.changePercent,
          iconUrl: hit.image,
        });
      }
    });
  }

  for (const row of rows) {
    if (out.has(row.symbol)) continue;
    try {
      const price = await livePrice(row.symbol, row.market, row.externalId);
      if (price > 0) {
        out.set(row.symbol, { price, changePercent: 0 });
      }
    } catch {
      // skip
    }
  }

  return out;
}

/** @deprecated Prefer fetchQuotesForCopyAssets batch helper */
export async function fetchQuoteForAsset(asset: {
  symbol: string;
  name?: string;
  market: string;
  externalId: string;
}): Promise<AssetQuote> {
  const map = await fetchQuotesForCopyAssets([
    { ...asset, name: asset.name ?? asset.symbol },
  ]);
  return map.get(asset.symbol) ?? { price: 0, changePercent: 0 };
}
