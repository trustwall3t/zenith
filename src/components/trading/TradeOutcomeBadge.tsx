import {
  tradeOutcomeBadgeClass,
  tradeOutcomeMeta,
} from "@/lib/trading/trade-outcome";

export function TradeOutcomeBadge({ status }: { status: string }) {
  const { label } = tradeOutcomeMeta(status);
  return <span className={tradeOutcomeBadgeClass(status)}>{label}</span>;
}
