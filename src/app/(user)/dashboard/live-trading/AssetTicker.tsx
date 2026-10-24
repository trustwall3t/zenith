"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FALLBACK_ICON } from "@/lib/trading/asset-logos";
import type { Asset, AssetCategory } from "@/types/trading";
import { cn } from "@/lib/utils";

interface AssetTickerProps {
  assets: Asset[];
  selectedSymbol: string;
  onSelect: (asset: Asset) => void;
}

function formatPrice(price: number, category: AssetCategory): string {
  if (!price || price <= 0) return "—";
  if (category === "crypto") {
    if (price >= 1000) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    if (price >= 1) return price.toFixed(2);
    if (price >= 0.01) return price.toFixed(4);
    return price.toFixed(6);
  }
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function AssetIcon({ src, symbol }: { src: string; symbol: string }) {
  const [iconSrc, setIconSrc] = useState(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={iconSrc}
      alt={symbol}
      className="h-9 w-9 rounded-md bg-muted object-contain"
      onError={() => {
        if (iconSrc !== FALLBACK_ICON) setIconSrc(FALLBACK_ICON);
      }}
    />
  );
}

export default function AssetTicker({
  assets,
  selectedSymbol,
  onSelect,
}: AssetTickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(
      (a) =>
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q),
    );
  }, [assets, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol or name…"
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-brand/30 focus:border-brand focus:ring-2"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {filtered.map((asset) => {
          const isSelected = asset.symbol === selectedSymbol;
          const isUp = asset.changePercent >= 0;
          return (
            <button
              key={asset.symbol}
              type="button"
              onClick={() => onSelect(asset)}
              className={cn(
                "flex w-[7.25rem] shrink-0 flex-col items-center gap-1.5 rounded-lg border p-3 text-left transition",
                isSelected
                  ? "border-brand bg-brand/5 shadow-sm"
                  : "border-border bg-card hover:border-brand/40",
              )}
            >
              <AssetIcon src={asset.iconUrl} symbol={asset.symbol} />
              <p className="text-xs font-semibold text-foreground">
                {asset.symbol}
              </p>
              <p className="text-[11px] tabular-nums text-muted-foreground">
                {formatPrice(asset.price, asset.category)}
              </p>
              <p
                className={cn(
                  "text-[11px] font-medium tabular-nums",
                  asset.price > 0
                    ? isUp
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                    : "text-muted-foreground",
                )}
              >
                {asset.price > 0 ? (
                  <>
                    {isUp ? "+" : ""}
                    {asset.changePercent.toFixed(2)}%
                  </>
                ) : (
                  "—"
                )}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
