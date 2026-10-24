/** Minimal live price fetch (Zenith MarketQuotes::livePrice parity). */
export async function livePrice(
  symbol: string,
  market: string,
  externalId?: string,
): Promise<number> {
  if (market === "CRYPTO" && externalId) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(externalId)}&vs_currencies=usd`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error("Crypto price unavailable");
    const json = (await res.json()) as Record<string, { usd?: number }>;
    const price = json[externalId]?.usd;
    if (!price || price <= 0) throw new Error("Invalid crypto price");
    return price;
  }

  const yahooSymbol = externalId ?? symbol;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1m&range=1d`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Stock price unavailable");
  const json = (await res.json()) as {
    chart?: { result?: Array<{ meta?: { regularMarketPrice?: number } }> };
  };
  const price = json.chart?.result?.[0]?.meta?.regularMarketPrice;
  if (!price || price <= 0) throw new Error("Invalid stock price");
  return price;
}
