export type AssetCategory = "stocks" | "crypto";

export interface Asset {
  symbol: string;
  name: string;
  iconUrl: string;
  category: AssetCategory;
  market: string;
  tradingViewSymbol: string;
  price: number;
  changePercent: number;
}

export type TradeDirection = "up" | "down";
export type TradeStatus = "open" | "won" | "lost" | "even" | "expired";

export const DURATIONS = [
  { label: "1m", seconds: 60 },
  { label: "5m", seconds: 300 },
  { label: "15m", seconds: 900 },
  { label: "1h", seconds: 3600 },
  { label: "4h", seconds: 14400 },
  { label: "1d", seconds: 86400 },
] as const;

export type DurationLabel = (typeof DURATIONS)[number]["label"];

export const CHART_INTERVALS = ["5M", "15M", "1H", "1D"] as const;
export type ChartInterval = (typeof CHART_INTERVALS)[number];

export const QUICK_STAKES = [10, 25, 50, 100, 250] as const;

export interface Trade {
  id: string;
  assetSymbol: string;
  assetName: string;
  direction: TradeDirection;
  stake: number;
  durationSeconds: number;
  entryPrice: number;
  exitPrice: number | null;
  profit: number | null;
  status: TradeStatus;
  openedAt: string;
  expiresAt: string;
  closedAt: string | null;
}
