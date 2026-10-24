import { NextResponse } from "next/server";
import type { MarketAsset } from "@/lib/market";
import {
  fetchCryptosMarkets,
  fetchStocksBySymbols,
} from "@/lib/market/fetch-quotes";

const TOP_STOCKS = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "META", name: "Meta" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "BRK-B", name: "Berkshire Hathaway" },
  { symbol: "JPM", name: "JPMorgan Chase" },
  { symbol: "V", name: "Visa" },
  { symbol: "UNH", name: "UnitedHealth" },
  { symbol: "XOM", name: "Exxon Mobil" },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "WMT", name: "Walmart" },
  { symbol: "MA", name: "Mastercard" },
] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") === "stocks" ? "stocks" : "crypto";

  try {
    const assets: MarketAsset[] =
      type === "stocks"
        ? await fetchStocksBySymbols([...TOP_STOCKS])
        : await fetchCryptosMarkets();

    return NextResponse.json({
      type,
      updatedAt: new Date().toISOString(),
      assets,
    });
  } catch (error) {
    console.error("Market quotes error:", error);
    return NextResponse.json(
      { error: "Failed to load market data" },
      { status: 502 },
    );
  }
}
