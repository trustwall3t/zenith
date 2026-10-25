import { db } from "@/lib/db";
import {
  nextGrowthAfter,
  formatIncrementInterval,
  resolvePlanLastGrowth,
} from "@/lib/investment/roi-schedule";

export type UserPlanView = {
  id: string;
  planId: number;
  planName: string;
  amount: number;
  profitEarned: number;
  status: string;
  activatedAt: string | null;
  expireDate: string | null;
  lastGrowth: string | null;
  nextPayoutAt: string;
  incrementLabel: string;
  isActive: boolean;
};

export type RoiPaymentView = {
  id: string;
  amount: number;
  planName: string | null;
  createdAt: string;
};

export async function getUserInvestmentPlanViews(
  userId: string,
): Promise<UserPlanView[]> {
  const rows = await db.userInvestmentPlan.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: [{ status: "asc" }, { activatedAt: "desc" }],
  });

  const now = new Date();

  return rows.map((row) => {
    const last = resolvePlanLastGrowth(
      {
        lastGrowth: row.lastGrowth,
        activatedAt: row.activatedAt,
        createdAt: row.createdAt,
        profitEarned: row.profitEarned,
      },
      row.plan.incrementInterval,
    );
    const nextPayoutAt = nextGrowthAfter(last, row.plan.incrementInterval);
    const isActive = row.status === "yes";

    return {
      id: row.id,
      planId: row.planId,
      planName: row.plan.name,
      amount: row.amount,
      profitEarned: row.profitEarned,
      status: row.status,
      activatedAt: row.activatedAt?.toISOString() ?? null,
      expireDate: row.expireDate?.toISOString() ?? null,
      lastGrowth: last.toISOString(),
      nextPayoutAt: nextPayoutAt.toISOString(),
      incrementLabel: `${row.plan.incrementAmount}% ${formatIncrementInterval(row.plan.incrementInterval)}`,
      isActive,
    };
  });
}

export async function getUserRoiHistory(
  userId: string,
  limit = 20,
): Promise<RoiPaymentView[]> {
  const rows = await db.transaction.findMany({
    where: {
      userId,
      OR: [
        { transactionType: { equals: "ROI", mode: "insensitive" } },
        { type: { equals: "ROI", mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      amount: true,
      planName: true,
      createdAt: true,
    },
  });

  return rows.map((r) => ({
    id: r.id,
    amount: r.amount,
    planName: r.planName,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** 0–100: elapsed share of plan term (activation → expiry). */
export function planTermProgressPercent(plan: {
  activatedAt: string | null;
  expireDate: string | null;
  isActive: boolean;
}): number | null {
  if (!plan.isActive || !plan.activatedAt || !plan.expireDate) {
    return null;
  }
  const start = new Date(plan.activatedAt).getTime();
  const end = new Date(plan.expireDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  const pct = ((now - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, pct));
}

export function summarizeActivePlans(plans: UserPlanView[]) {
  const active = plans.filter((p) => p.isActive);
  return {
    count: active.length,
    principal: active.reduce((s, p) => s + p.amount, 0),
    profitEarned: active.reduce((s, p) => s + p.profitEarned, 0),
  };
}
