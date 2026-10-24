import type { MarketAsset } from "@/lib/market";
import { downsampleSparkline, resolveSparkline } from "@/lib/market/sparkline-utils";

export async function fetchCryptosMarkets(
  externalIds?: string[],
): Promise<MarketAsset[]> {
  const ids = externalIds?.filter(Boolean);
  const url =
    ids && ids.length > 0
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids.join(","))}&sparkline=true&price_change_percentage=24h&per_page=250`
      : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=true&price_change_percentage=24h";

  const res = await fetch(url, {
    next: { revalidate: 30 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Crypto fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as Array<{
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_24h: number | null;
    price_change_percentage_24h: number | null;
    image: string;
    sparkline_in_7d?: { price?: number[] };
  }>;

  return data.map((coin) => {
    const price = coin.current_price ?? 0;
    const changePercent = coin.price_change_percentage_24h ?? 0;
    const rawSpark = coin.sparkline_in_7d?.price;
    return {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price,
      changePercent,
      changeAbsolute: coin.price_change_24h ?? 0,
      image: coin.image,
      sparkline: resolveSparkline(rawSpark, price, changePercent),
    };
  });
}

export async function fetchStockQuote(
  symbol: string,
  fallbackName: string,
): Promise<MarketAsset> {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=30m&range=5d`,
    {
      next: { revalidate: 30 },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Stock fetch failed for ${symbol}: ${res.status}`);
  }

  const data = (await res.json()) as {
    chart?: {
      result?: Array<{
        meta?: {
          shortName?: string;
          longName?: string;
          regularMarketPrice?: number;
          regularMarketChangePercent?: number;
          fulldayChange?: number;
          chartPreviousClose?: number;
        };
        indicators?: {
          quote?: Array<{ close?: Array<number | null> }>;
        };
      }>;
    };
  };

  const result = data.chart?.result?.[0];
  const meta = result?.meta;
  const closes =
    result?.indicators?.quote?.[0]?.close?.filter(
      (c): c is number => c != null && Number.isFinite(c) && c > 0,
    ) ?? [];
  const price = meta?.regularMarketPrice ?? 0;
  const changePercent = meta?.regularMarketChangePercent ?? 0;
  const previousClose = meta?.chartPreviousClose ?? 0;
  const changeAbsolute =
    meta?.fulldayChange ?? (previousClose ? price - previousClose : 0);

  return {
    id: symbol,
    symbol,
    name: meta?.shortName || meta?.longName || fallbackName,
    price,
    changePercent,
    changeAbsolute,
    image: `https://financialmodelingprep.com/image-stock/${encodeURIComponent(symbol)}.png`,
    sparkline: resolveSparkline(
      closes.length ? downsampleSparkline(closes) : undefined,
      price,
      changePercent,
    ),
  };
}

export async function fetchCryptoFromBinance(
  symbol: string,
): Promise<Pick<MarketAsset, "price" | "changePercent"> | null> {
  const pair = `${symbol.toUpperCase()}USDT`;
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(pair)}`,
      { next: { revalidate: 15 }, headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      lastPrice?: string;
      priceChangePercent?: string;
    };
    const price = Number(data.lastPrice);
    if (!Number.isFinite(price) || price <= 0) return null;
    return {
      price,
      changePercent: Number(data.priceChangePercent ?? 0),
    };
  } catch {
    return null;
  }
}

export async function fetchStocksBySymbols(
  symbols: Array<{ symbol: string; name: string }>,
): Promise<MarketAsset[]> {
  const results = await Promise.allSettled(
    symbols.map((s) => fetchStockQuote(s.symbol, s.name)),
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<MarketAsset> => r.status === "fulfilled",
    )
    .map((r) => r.value);
}
