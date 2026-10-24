import { cn } from "@/lib/utils";

export type TradeOutcomeKind = "won" | "lost" | "even" | "open" | "expired";

export function tradeOutcomeMeta(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "won":
      return {
        label: "Positive",
        className:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      };
    case "lost":
      return {
        label: "Negative",
        className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      };
    case "even":
      return {
        label: "Break even",
        className: "bg-muted text-muted-foreground border-border",
      };
    case "open":
      return {
        label: "Open",
        className:
          "bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30",
      };
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        className: "bg-muted text-muted-foreground border-border",
      };
  }
}

export function formatTradePl(
  status: string,
  profit: number | null | undefined,
): string {
  if (status === "open") return "—";
  if (profit == null) return "—";
  if (status === "even" || profit === 0) return "$0.00";
  const sign = profit > 0 ? "+" : "-";
  return `${sign}$${Math.abs(profit).toFixed(2)}`;
}

export function tradeOutcomeBadgeClass(status: string): string {
  return cn(
    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
    tradeOutcomeMeta(status).className,
  );
}
