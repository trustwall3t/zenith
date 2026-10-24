export function money(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function stake(balance: number, allocationPct: number): number {
  if (allocationPct <= 0 || balance <= 0) return 0;
  return money(balance * (allocationPct / 100));
}

export type TradeOutcomeStatus = "won" | "lost" | "even";

export function computeTrade(
  entry: number,
  exit: number,
  stakeAmount: number,
  direction: "up" | "down",
): { profit: number; credit: number; status: TradeOutcomeStatus } {
  if (entry <= 0) throw new Error("Entry price must be positive.");
  const raw = (exit - entry) / entry;
  const signed = direction === "down" ? -raw : raw;
  let profit = money(Math.max(stakeAmount * signed, -stakeAmount));
  if (Math.abs(profit) < 0.005) profit = 0;
  const credit = money(stakeAmount + profit);
  const status = profit > 0 ? "won" : profit < 0 ? "lost" : "even";
  return { profit, credit, status };
}

function rollSettlementOutcome(
  targetWinRate: number,
  winProfitPctRange: readonly [number, number],
  lossPctRange: readonly [number, number],
): { status: TradeOutcomeStatus; profitRatio: number } {
  const r = Math.random();
  if (r < targetWinRate) {
    const [min, max] = winProfitPctRange;
    return { status: "won", profitRatio: min + Math.random() * (max - min) };
  }

  const nonWin = 1 - targetWinRate;
  if (nonWin > 0 && r < targetWinRate + nonWin * 0.15) {
    return { status: "even", profitRatio: 0 };
  }

  const [lossMin, lossMax] = lossPctRange;
  const lossPct = lossMin + Math.random() * (lossMax - lossMin);
  return { status: "lost", profitRatio: -Math.min(lossPct, 1) };
}

/** Exit price that matches profit for the chosen direction (display consistency). */
export function exitPriceForProfit(
  entry: number,
  stakeAmount: number,
  profit: number,
  direction: "up" | "down",
): number {
  if (entry <= 0 || stakeAmount <= 0) return entry;
  if (profit === 0) return entry;
  const signed = profit / stakeAmount;
  const raw = direction === "down" ? -signed : signed;
  return money(entry * (1 + raw));
}

export function applySettlementPolicy(
  entry: number,
  stakeAmount: number,
  direction: "up" | "down",
  policy: {
    targetWinRate: number;
    winProfitPctMin: number;
    winProfitPctMax: number;
    lossPctMin: number;
    lossPctMax: number;
  },
): { profit: number; credit: number; status: TradeOutcomeStatus; exitPrice: number } {
  const { profitRatio } = rollSettlementOutcome(
    policy.targetWinRate,
    [policy.winProfitPctMin, policy.winProfitPctMax],
    [policy.lossPctMin, policy.lossPctMax],
  );

  let profit =
    profitRatio === 0
      ? 0
      : money(Math.max(stakeAmount * profitRatio, -stakeAmount));
  if (Math.abs(profit) < 0.005) profit = 0;

  const status: TradeOutcomeStatus =
    profit > 0 ? "won" : profit < 0 ? "lost" : "even";
  const exitPrice = exitPriceForProfit(entry, stakeAmount, profit, direction);
  const credit = money(stakeAmount + profit);
  return { profit, credit, status, exitPrice };
}
