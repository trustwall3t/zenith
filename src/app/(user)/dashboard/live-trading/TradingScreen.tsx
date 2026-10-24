"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { placeTrade } from "@/actions/user/placeTrade";
import { syncTrades } from "@/actions/user/syncTrade";
import { refreshAssetPricesAction } from "@/actions/user/refreshPrices";
import AssetTicker from "./AssetTicker";
import TradePanel from "./TradePanel";
import TradesList from "./TradeList";
import {
  CHART_INTERVALS,
  type Asset,
  type AssetCategory,
  type ChartInterval,
  type Trade,
  type TradeDirection,
} from "@/types/trading";
import { mergeOpenTrades } from "@/lib/trading/merge-open-trades";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const TradingViewWidget = dynamic(() => import("./TradingviewWidget"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] animate-pulse rounded-lg border border-border bg-muted lg:h-[420px]" />
  ),
});

const CHART_INTERVAL_MAP: Record<ChartInterval, string> = {
  "5M": "5",
  "15M": "15",
  "1H": "60",
  "1D": "D",
};

const TRADE_POLL_INTERVAL_MS = 5000;
const TRADE_POLL_FAST_MS = 1500;
const TRADE_POLL_IDLE_MS = 15000;
const PRICE_POLL_INTERVAL_MS = 60_000;

function firstPricedAsset(list: Asset[]) {
  return list.find((a) => a.price > 0) ?? list[0];
}

function initialTradingState(assets: Asset[]) {
  const crypto = assets.filter((a) => a.category === "crypto");
  const stocks = assets.filter((a) => a.category === "stocks");
  const cryptoPriced = crypto.filter((a) => a.price > 0).length;
  const stocksPriced = stocks.filter((a) => a.price > 0).length;
  const category: AssetCategory =
    stocksPriced >= cryptoPriced ? "stocks" : "crypto";
  const pool = category === "stocks" ? stocks : crypto;
  const pick = firstPricedAsset(pool) ?? firstPricedAsset(assets);
  return { category, symbol: pick?.symbol ?? "" };
}

interface TradingScreenProps {
  assets: Asset[];
  initialBalance: number;
  initialOpenTrades: Trade[];
  initialHistory: Trade[];
}

export default function TradingScreen({
  assets,
  initialBalance,
  initialOpenTrades,
  initialHistory,
}: TradingScreenProps) {
  const router = useRouter();
  const [category, setCategory] = useState<AssetCategory>(
    () => initialTradingState(assets).category,
  );
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    () => initialTradingState(assets).symbol,
  );
  const [chartInterval, setChartInterval] = useState<ChartInterval>("5M");
  const placingRef = useRef(false);
  const syncInFlightRef = useRef(false);
  const notifiedTradeIdsRef = useRef(new Set<string>());

  const [balance, setBalance] = useState(initialBalance);
  const [openTrades, setOpenTrades] = useState<Trade[]>(initialOpenTrades);
  const [history, setHistory] = useState<Trade[]>(initialHistory);
  const [liveAssets, setLiveAssets] = useState<Asset[]>(assets);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date>(() => new Date());

  const visibleAssets = useMemo(
    () => liveAssets.filter((a) => a.category === category),
    [liveAssets, category],
  );

  const selectedAsset = useMemo(() => {
    const match = liveAssets.find((a) => a.symbol === selectedSymbol);
    if (match) return match;
    return visibleAssets[0] ?? liveAssets[0];
  }, [liveAssets, selectedSymbol, visibleAssets]);

  useEffect(() => {
    const visible = liveAssets.filter((a) => a.category === category);
    const stillVisible = visible.some((a) => a.symbol === selectedSymbol);
    if (!stillVisible && visible[0]) {
      setSelectedSymbol(visible[0].symbol);
    }
  }, [category, liveAssets, selectedSymbol]);

  useEffect(() => {
    const current = liveAssets.find((a) => a.symbol === selectedSymbol);
    if (current && current.price > 0) return;
    const pool = liveAssets.filter((a) => a.category === category);
    const better = firstPricedAsset(pool) ?? firstPricedAsset(liveAssets);
    if (better?.symbol && better.symbol !== selectedSymbol) {
      setSelectedSymbol(better.symbol);
    }
  }, [liveAssets, category, selectedSymbol]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromMarketApi() {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch("/api/market/quotes?type=crypto"),
          fetch("/api/market/quotes?type=stocks"),
        ]);
        const cJson = cRes.ok
          ? ((await cRes.json()) as {
              assets?: Array<{
                symbol: string;
                price: number;
                changePercent: number;
                image?: string;
              }>;
            })
          : { assets: [] };
        const sJson = sRes.ok
          ? ((await sRes.json()) as {
              assets?: Array<{
                symbol: string;
                price: number;
                changePercent: number;
                image?: string;
              }>;
            })
          : { assets: [] };

        const bySymbol = new Map<
          string,
          { price: number; changePercent: number; iconUrl?: string }
        >();
        for (const row of [...(cJson.assets ?? []), ...(sJson.assets ?? [])]) {
          bySymbol.set(row.symbol.toUpperCase(), {
            price: row.price,
            changePercent: row.changePercent,
            iconUrl: row.image,
          });
        }

        if (cancelled || bySymbol.size === 0) return;

        setLiveAssets((prev) =>
          prev.map((asset) => {
            const update = bySymbol.get(asset.symbol.toUpperCase());
            if (!update || update.price <= 0) return asset;
            return {
              ...asset,
              price: update.price,
              changePercent: update.changePercent,
              iconUrl: update.iconUrl ?? asset.iconUrl,
            };
          }),
        );
        setLastPriceUpdate(new Date());
      } catch (err) {
        console.error("Market API hydrate failed:", err);
      }
    }

    void hydrateFromMarketApi();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    for (const trade of initialHistory) {
      notifiedTradeIdsRef.current.add(trade.id);
    }
  }, [initialHistory]);

  const openTradesRef = useRef(openTrades);
  openTradesRef.current = openTrades;

  const hasExpiredOpenTrades = useMemo(
    () =>
      openTrades.some(
        (t) =>
          t.status === "open" &&
          new Date(t.expiresAt).getTime() <= Date.now(),
      ),
    [openTrades],
  );

  const notifySettlements = (
    previous: Trade[],
    result: { openTrades: Trade[]; history: Trade[] },
  ) => {
    for (const trade of previous) {
      if (trade.id.startsWith("pending-")) continue;
      if (result.openTrades.some((o) => o.id === trade.id)) continue;

      const settled = result.history.find((h) => h.id === trade.id);
      if (!settled || notifiedTradeIdsRef.current.has(settled.id)) continue;

      notifiedTradeIdsRef.current.add(settled.id);

      if (settled.status === "won") {
        toast.success(
          `${settled.assetSymbol} won +$${settled.profit?.toFixed(2)}`,
        );
      } else if (settled.status === "lost") {
        toast.error(
          `${settled.assetSymbol} lost $${Math.abs(settled.profit ?? 0).toFixed(2)}`,
        );
      }
    }
  };

  const refreshTrades = async () => {
    if (syncInFlightRef.current) return;
    syncInFlightRef.current = true;

    try {
      const previous = openTradesRef.current;
      const result = await syncTrades();
      if ("error" in result) return;

      notifySettlements(previous, result);
      setBalance(result.balance);
      setOpenTrades((prev) => mergeOpenTrades(prev, result.openTrades));
      setHistory(result.history);
    } finally {
      syncInFlightRef.current = false;
    }
  };

  const refreshPrices = async () => {
    try {
      const updates = await refreshAssetPricesAction();
      if (!updates.length) return;

      const bySymbol = new Map(updates.map((u) => [u.symbol, u]));
      setLiveAssets((prev) =>
        prev.map((asset) => {
          const update = bySymbol.get(asset.symbol);
          if (!update) return asset;
          return {
            ...asset,
            price: update.price,
            changePercent: update.changePercent,
            iconUrl: update.iconUrl ?? asset.iconUrl,
          };
        }),
      );
      setLastPriceUpdate(new Date());
    } catch (err) {
      console.error("Price refresh failed:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshPrices, PRICE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void refreshTrades();

    const pollMs = hasExpiredOpenTrades
      ? TRADE_POLL_FAST_MS
      : openTrades.length > 0
        ? TRADE_POLL_INTERVAL_MS
        : TRADE_POLL_IDLE_MS;

    const interval = setInterval(refreshTrades, pollMs);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasExpiredOpenTrades, openTrades.length]);

  const handlePlaceTrade = ({
    direction,
    stake,
    durationSeconds,
  }: {
    direction: TradeDirection;
    stake: number;
    durationSeconds: number;
  }) => {
    if (!selectedAsset || placingRef.current) return;
    if (selectedAsset.price <= 0) {
      toast.error("Price not loaded yet — wait a moment and try again.");
      return;
    }

    const stakeAmount = Math.round(stake * 100) / 100;
    if (stakeAmount <= 0 || stakeAmount > balance) return;

    placingRef.current = true;

    const openedAt = new Date();
    const expiresAt = new Date(openedAt.getTime() + durationSeconds * 1000);
    const tempId = `pending-${openedAt.getTime()}`;

    const optimisticTrade: Trade = {
      id: tempId,
      assetSymbol: selectedAsset.symbol,
      assetName: selectedAsset.name,
      direction,
      stake: stakeAmount,
      durationSeconds,
      entryPrice: selectedAsset.price,
      exitPrice: null,
      profit: null,
      status: "open",
      openedAt: openedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      closedAt: null,
    };

    setBalance((prev) => prev - stakeAmount);
    setOpenTrades((prev) => [optimisticTrade, ...prev]);
    toast.success(
      `Trade placed: ${direction.toUpperCase()} ${selectedAsset.symbol}`,
    );

    const formData = new FormData();
    formData.append("assetSymbol", selectedAsset.symbol);
    formData.append("direction", direction);
    formData.append("stake", String(stakeAmount));
    formData.append("durationSeconds", String(durationSeconds));

    void placeTrade(formData)
      .then((result) => {
        if (result?.error) {
          setBalance((prev) => prev + stakeAmount);
          setOpenTrades((prev) => prev.filter((t) => t.id !== tempId));
          toast.error(result.error);
          return;
        }

        if (result.balance != null) {
          setBalance(result.balance);
        }

        if (result.trade) {
          setOpenTrades((prev) =>
            prev.map((t) => (t.id === tempId ? result.trade! : t)),
          );
        }
        void refreshTrades();
        router.refresh();
      })
      .catch(() => {
        setBalance((prev) => prev + stakeAmount);
        setOpenTrades((prev) => prev.filter((t) => t.id !== tempId));
        toast.error("Failed to place trade. Please try again.");
      })
      .finally(() => {
        placingRef.current = false;
      });
  };

  if (!selectedAsset) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        No tradeable assets are available right now.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
          {(["stocks", "crypto"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium capitalize transition",
                category === cat
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          {visibleAssets.length} symbols · Prices refresh every minute · Updated{" "}
          {lastPriceUpdate.toLocaleTimeString()}
        </p>
      </div>

      <AssetTicker
        assets={visibleAssets}
        selectedSymbol={selectedAsset.symbol}
        onSelect={(asset) => setSelectedSymbol(asset.symbol)}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedAsset.iconUrl}
                alt={selectedAsset.symbol}
                className="h-11 w-11 rounded-lg border border-border bg-muted object-contain"
              />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedAsset.symbol}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedAsset.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold tabular-nums text-foreground">
                {selectedAsset.price > 0
                  ? selectedAsset.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: selectedAsset.category === "crypto" ? 4 : 2,
                    })
                  : "—"}
              </p>
              <p
                className={cn(
                  "text-sm font-medium tabular-nums",
                  selectedAsset.changePercent >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {selectedAsset.price > 0 ? (
                  <>
                    {selectedAsset.changePercent >= 0 ? "+" : ""}
                    {selectedAsset.changePercent.toFixed(2)}%
                  </>
                ) : (
                  "Loading…"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CHART_INTERVALS.map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => setChartInterval(interval)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-semibold transition",
                  chartInterval === interval
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {interval}
              </button>
            ))}
          </div>

          <TradingViewWidget
            symbol={selectedAsset.tradingViewSymbol}
            interval={CHART_INTERVAL_MAP[chartInterval]}
          />

          <TradesList openTrades={openTrades} history={history} />
        </div>

        <div className="lg:col-span-1">
          <TradePanel
            balance={balance}
            currentPrice={selectedAsset.price}
            onPlaceTrade={handlePlaceTrade}
          />
        </div>
      </div>
    </div>
  );
}
