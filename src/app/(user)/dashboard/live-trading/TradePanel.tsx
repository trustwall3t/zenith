"use client";

import { useState } from "react";
import {
  DURATIONS,
  type DurationLabel,
  QUICK_STAKES,
  type TradeDirection,
} from "@/types/trading";
import { cn } from "@/lib/utils";

interface TradePanelProps {
  balance: number;
  currentPrice: number;
  onPlaceTrade: (params: {
    direction: TradeDirection;
    stake: number;
    durationSeconds: number;
  }) => void;
}

export default function TradePanel({
  balance,
  currentPrice,
  onPlaceTrade,
}: TradePanelProps) {
  const [durationLabel, setDurationLabel] = useState<DurationLabel>("5m");
  const [stakeInput, setStakeInput] = useState("");

  const stake = Number(stakeInput) || 0;
  const selectedDuration = DURATIONS.find((d) => d.label === durationLabel)!;
  const canTrade = stake > 0 && stake <= balance;

  const handleTrade = (direction: TradeDirection) => {
    if (!canTrade) return;
    onPlaceTrade({
      direction,
      stake,
      durationSeconds: selectedDuration.seconds,
    });
    setStakeInput("");
  };

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card p-4 lg:p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Available balance
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Duration
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => setDurationLabel(d.label)}
              className={cn(
                "rounded-md border py-2 text-sm font-semibold transition",
                durationLabel === d.label
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-background text-foreground hover:border-brand/50",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Stake (USD)
        </p>
        <input
          type="number"
          min={0}
          value={stakeInput}
          onChange={(e) => setStakeInput(e.target.value)}
          placeholder="Enter amount"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm tabular-nums outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <div className="flex flex-wrap gap-2">
          {QUICK_STAKES.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setStakeInput(String(amount))}
              className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              ${amount}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStakeInput(String(Math.floor(balance)))}
            className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Max
          </button>
        </div>
      </div>

      <p className="rounded-md border border-border/80 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
        Returns follow the price move over your chosen window, capped so you
        cannot lose more than your stake.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!canTrade}
          onClick={() => handleTrade("down")}
          className="rounded-lg bg-red-600 py-4 text-center font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="text-xs tracking-wide">SELL / DOWN</p>
          <p className="mt-1 text-sm tabular-nums font-semibold">
            {currentPrice > 0 ? currentPrice.toFixed(2) : "—"}
          </p>
        </button>
        <button
          type="button"
          disabled={!canTrade}
          onClick={() => handleTrade("up")}
          className="rounded-lg bg-emerald-600 py-4 text-center font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="text-xs tracking-wide">BUY / UP</p>
          <p className="mt-1 text-sm tabular-nums font-semibold">
            {currentPrice > 0 ? currentPrice.toFixed(2) : "—"}
          </p>
        </button>
      </div>

      {stake > balance && (
        <p className="text-center text-xs text-red-600 dark:text-red-400">
          Stake exceeds available balance.
        </p>
      )}
    </div>
  );
}
