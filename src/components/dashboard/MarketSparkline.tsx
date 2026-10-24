"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "@/lib/utils";

type MarketSparklineProps = {
  data: number[];
  positive: boolean;
  className?: string;
  gradientId: string;
};

export function MarketSparkline({
  data,
  positive,
  className,
  gradientId,
}: MarketSparklineProps) {
  const chartData = useMemo(
    () => data.map((value, i) => ({ i, value })),
    [data],
  );

  if (chartData.length < 2) {
    return (
      <div
        className={cn(
          "h-11 w-full min-w-[88px] max-w-[140px] rounded-md bg-muted/50",
          className,
        )}
        aria-hidden
      />
    );
  }

  const stroke = positive ? "var(--brand)" : "hsl(0 72% 51%)";
  const fillId = `spark-fill-${gradientId}`;

  return (
    <div
      className={cn(
        "h-11 w-full min-w-[88px] max-w-[140px]",
        className,
      )}
      aria-hidden
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={1.75}
            fill={`url(#${fillId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
