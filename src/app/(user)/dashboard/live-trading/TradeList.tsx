"use client";

import { useEffect, useState } from "react";
import type { Trade } from "@/types/trading";
import { TradeOutcomeBadge } from "@/components/trading/TradeOutcomeBadge";
import { formatTradePl } from "@/lib/trading/trade-outcome";
import { cn } from "@/lib/utils";

function formatCountdown(expiresAt: string): string {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "Settling…";
  const totalSeconds = Math.floor(diffMs / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TradeRow({ trade }: { trade: Trade }) {
  const [, tick] = useState(0);

  useEffect(() => {
    if (trade.status !== "open") return;
    const interval = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [trade.status, trade.expiresAt]);

  const isOpen = trade.status === "open";
  const isWin = trade.status === "won";
  const isLoss = trade.status === "lost";
  const isEven = trade.status === "even";

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background/80 p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {trade.assetSymbol}{" "}
          <span
            className={
              trade.direction === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {trade.direction === "up" ? "UP" : "DOWN"}
          </span>
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          Stake ${trade.stake.toFixed(2)} · Entry {trade.entryPrice.toFixed(2)}
          {trade.exitPrice != null && (
            <> · Exit {trade.exitPrice.toFixed(2)}</>
          )}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        {isOpen ? (
          <>
            <TradeOutcomeBadge status="open" />
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 tabular-nums">
              {formatCountdown(trade.expiresAt)}
            </p>
          </>
        ) : (
          <>
            <TradeOutcomeBadge status={trade.status} />
            <p
              className={cn(
                "text-sm font-bold tabular-nums",
                isWin && "text-emerald-600 dark:text-emerald-400",
                isLoss && "text-red-600 dark:text-red-400",
                isEven && "text-muted-foreground font-medium",
              )}
            >
              {formatTradePl(trade.status, trade.profit)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

interface TradesListProps {
  openTrades: Trade[];
  history: Trade[];
}

export default function TradesList({ openTrades, history }: TradesListProps) {
  const [tab, setTab] = useState<"open" | "history">("open");
  const trades = tab === "open" ? openTrades : history;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex gap-6 border-b border-border">
        {(
          [
            ["open", `Open (${openTrades.length})`],
            ["history", `History (${history.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "pb-2.5 text-sm font-medium transition",
              tab === key
                ? "border-b-2 border-brand text-brand"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-h-72 overflow-y-auto overscroll-contain">
        {trades.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {tab === "open" ? "No open positions." : "No closed trades yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-2 pr-1">
            {trades.map((trade) => (
              <TradeRow key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
