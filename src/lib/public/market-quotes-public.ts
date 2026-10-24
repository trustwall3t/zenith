import type { MarketQuotesPayload } from "@/types/site";

const CRYPTO_IDS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "ripple",
  "dogecoin",
  "cardano",
  "tron",
  "avalanche-2",
];

const STOCKS = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "TSLA", name: "Tesla" },
];

function formatPrice(price: number, stock: boolean): string {
  if (stock || price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6).replace(/\.?0+$/, "")}`;
}

function formatChange(change: number): string {
  if (Math.abs(change) < 0.005) return "0.00%";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

function direction(change: number): string {
  if (Math.abs(change) < 0.005) return "flat";
  return change > 0 ? "up" : "down";
}

function row(
  symbol: string,
  name: string,
  price: number,
  change: number,
  stock: boolean,
  logo?: string,
): Record<string, string> {
  const dir = direction(change);
  return {
    symbol,
    name,
    logo: logo ?? "",
    price_label: formatPrice(price, stock),
    change_label: formatChange(change),
    dir,
    change_class: `gg-market-ticker-change--${dir}`,
  };
}

async function fetchCryptoRows(): Promise<Record<string, string>[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?${new URLSearchParams({
    vs_currency: "usd",
    ids: CRYPTO_IDS.join(","),
    order: "market_cap_desc",
    sparkline: "false",
    price_change_percentage: "24h",
  })}`;
  const res = await fetch(url, {
    next: { revalidate: 90 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number | null;
    image: string;
  }>;
  return data.map((c) =>
    row(
      c.symbol.toUpperCase(),
      c.name,
      c.current_price ?? 0,
      c.price_change_percentage_24h ?? 0,
      false,
      c.image,
    ),
  );
}

async function fetchStockRows(): Promise<Record<string, string>[]> {
  const out: Record<string, string>[] = [];
  for (const s of STOCKS) {
    try {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s.symbol)}?interval=1d&range=5d`,
        {
          next: { revalidate: 90 },
          headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
        },
      );
      if (!res.ok) continue;
      const data = (await res.json()) as {
        chart?: { result?: Array<{ meta?: Record<string, number | string> }> };
      };
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) continue;
      const price = Number(meta.regularMarketPrice ?? 0);
      const change = Number(meta.regularMarketChangePercent ?? 0);
      const name =
        String(meta.shortName || meta.longName || s.name) || s.name;
      out.push(
        row(
          s.symbol,
          name,
          price,
          change,
          true,
          `https://financialmodelingprep.com/image-stock/${encodeURIComponent(s.symbol)}.png`,
        ),
      );
    } catch {
      /* skip symbol */
    }
  }
  return out;
}

export async function getPublicMarketQuotes(): Promise<MarketQuotesPayload> {
  const [cryptoRows, stockRows] = await Promise.all([
    fetchCryptoRows(),
    fetchStockRows(),
  ]);
  return {
    crypto: { ok: cryptoRows.length > 0, rows: cryptoRows },
    stocks: { ok: stockRows.length > 0, rows: stockRows },
  };
}

export function emptyMarketQuotes(): MarketQuotesPayload {
  return {
    crypto: { ok: false, rows: [] },
    stocks: { ok: false, rows: [] },
  };
}
