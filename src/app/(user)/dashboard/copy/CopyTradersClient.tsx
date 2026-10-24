"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Search, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Trader = {
  id: number;
  name: string;
  description: string | null;
  strategy: string | null;
  market: string;
  winRate: { toString(): string } | null;
  followers: number;
  totalTrades?: number;
};

type Sub = {
  traderId: number;
  allocationPercentage: { toString(): string };
  trader: Trader;
};

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function CopyTradersClient({
  traders,
  subscriptions,
}: {
  traders: Trader[];
  subscriptions: Sub[];
}) {
  const router = useRouter();
  const [allocation, setAllocation] = useState(10);
  const [busy, setBusy] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const activeByTrader = useMemo(() => {
    const map = new Map<number, number>();
    for (const s of subscriptions) {
      map.set(s.traderId, Number(s.allocationPercentage.toString()));
    }
    return map;
  }, [subscriptions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return traders;
    return traders.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.market.toLowerCase().includes(q) ||
        (t.strategy?.toLowerCase().includes(q) ?? false),
    );
  }, [traders, query]);

  async function subscribe(traderId: number) {
    setBusy(traderId);
    try {
      const res = await fetch("/api/copy/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traderId, allocation }),
      });
      const j = await res.json();
      if (!res.ok) {
        toast.error(j.error ?? "Could not start copying");
        return;
      }
      toast.success("Copy trading activated");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-brand/20 bg-gradient-to-br from-brand/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Mirror expert strategies</CardTitle>
          <CardDescription>
            Allocate a percentage of your wallet balance. When admins emit
            signals, matching positions open automatically and settle like
            self-trades.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="text-sm text-muted-foreground">
            Default allocation for new subscriptions
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={100}
                value={allocation}
                onChange={(e) => setAllocation(Number(e.target.value))}
                className="w-40 accent-brand"
              />
              <span className="w-12 text-right text-sm font-semibold tabular-nums text-foreground">
                {allocation}%
              </span>
            </div>
          </label>
          <p className="text-xs text-muted-foreground max-w-sm">
            You can change allocation when starting each trader. Active copies
            appear in Copy history.
          </p>
        </CardContent>
      </Card>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, market, or strategy…"
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No traders match your search.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => {
            const activePct = activeByTrader.get(t.id);
            const isActive = activePct != null;
            const winRate = t.winRate?.toString() ?? "—";

            return (
              <Card
                key={t.id}
                className={cn(
                  "flex flex-col transition-shadow hover:shadow-md",
                  isActive && "border-brand/40 ring-1 ring-brand/20",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                        {initials(t.name)}
                      </div>
                      <div>
                        <CardTitle className="text-base leading-tight">
                          {t.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {t.market} · {t.strategy ?? "Multi-strategy"}
                        </CardDescription>
                      </div>
                    </div>
                    {isActive && (
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {t.description ?? "Professional copy-trading profile."}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        Followers
                      </p>
                      <p className="mt-0.5 font-semibold tabular-nums">
                        {t.followers.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Win rate
                      </p>
                      <p className="mt-0.5 font-semibold tabular-nums">
                        {winRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  {isActive ? (
                    <p className="w-full text-center text-sm font-medium text-brand">
                      Copying at {activePct}% allocation
                    </p>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={busy === t.id}
                      onClick={() => subscribe(t.id)}
                    >
                      {busy === t.id ? "Starting…" : "Start copying"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
