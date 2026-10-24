import { db } from "@/lib/db";
import { nextGrowthAfter } from "@/lib/investment/roi-schedule";

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
    const last =
      row.lastGrowth ?? row.activatedAt ?? row.createdAt ?? now;
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
      lastGrowth: row.lastGrowth?.toISOString() ?? null,
      nextPayoutAt: nextPayoutAt.toISOString(),
      incrementLabel: `${row.plan.incrementAmount}% ${row.plan.incrementInterval}`,
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

export function summarizeActivePlans(plans: UserPlanView[]) {
  const active = plans.filter((p) => p.isActive);
  return {
    count: active.length,
    principal: active.reduce((s, p) => s + p.amount, 0),
    profitEarned: active.reduce((s, p) => s + p.profitEarned, 0),
  };
}
