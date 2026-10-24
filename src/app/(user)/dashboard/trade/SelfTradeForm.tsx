"use client";

import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { COPY_TRADING } from "@/config/copy-trading";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SelfTradeForm({
  assets,
  walletBalance,
}: {
  assets: { symbol: string; name: string; market: string }[];
  walletBalance: number;
}) {
  const router = useRouter();
  const [symbol, setSymbol] = useState(assets[0]?.symbol ?? "BTC");
  const [market, setMarket] = useState(assets[0]?.market ?? "CRYPTO");
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [durationSeconds, setDurationSeconds] = useState(900);
  const [stake, setStake] = useState(100);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/trade/self", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, market, direction, durationSeconds, stake }),
      });
      const j = await res.json();
      if (!res.ok) {
        alert(j.error ?? "Trade failed");
        return;
      }
      router.refresh();
      router.push("/dashboard/copy/history");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardPanel>
      <form onSubmit={submit} className="p-4 space-y-4 max-w-md">
        <p className="text-sm text-muted-foreground">
          Wallet balance: ${walletBalance.toLocaleString()}
        </p>
        <label className="block text-sm">
          Asset
          <select
            className="mt-1 w-full rounded border border-border px-2 py-2"
            value={symbol}
            onChange={(e) => {
              const a = assets.find((x) => x.symbol === e.target.value);
              setSymbol(e.target.value);
              if (a) setMarket(a.market);
            }}
          >
            {assets.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Direction
          <select
            className="mt-1 w-full rounded border border-border px-2 py-2"
            value={direction}
            onChange={(e) => setDirection(e.target.value as "up" | "down")}
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
          </select>
        </label>
        <label className="block text-sm">
          Duration
          <select
            className="mt-1 w-full rounded border border-border px-2 py-2"
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
          >
            {Object.entries(COPY_TRADING.selfDurations).map(([sec, label]) => (
              <option key={sec} value={sec}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Stake ($)
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded border border-border px-2 py-2"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
          />
        </label>
        <Button type="submit" disabled={busy}>
          Place trade
        </Button>
      </form>
    </DashboardPanel>
  );
}
