export const FALLBACK_ICON = "/logo.png";

export function stockIconUrl(symbol: string): string {
  return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(symbol)}.png`;
}

export function defaultIconUrl(symbol: string, market: string): string {
  if (market.toUpperCase() === "CRYPTO") {
    return `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/200`;
  }
  return stockIconUrl(symbol);
}
