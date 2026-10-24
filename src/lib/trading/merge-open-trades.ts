import type { Trade } from "@/types/trading";

/** Keep optimistic pending rows until the server returns the real open trade. */
export function mergeOpenTrades(local: Trade[], server: Trade[]): Trade[] {
  const pending = local.filter((t) => t.id.startsWith("pending-"));
  const keptPending = pending.filter(
    (p) =>
      !server.some(
        (s) =>
          s.assetSymbol === p.assetSymbol &&
          s.direction === p.direction &&
          Math.abs(s.stake - p.stake) < 0.01 &&
          Math.abs(
            new Date(s.openedAt).getTime() - new Date(p.openedAt).getTime(),
          ) < 120_000,
      ),
  );
  return [...keptPending, ...server];
}
