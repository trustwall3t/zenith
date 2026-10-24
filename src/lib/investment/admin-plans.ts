import { db } from "@/lib/db";
import { nextGrowthAfter } from "@/lib/investment/roi-schedule";

export type AdminUserPlanRow = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  profitEarned: number;
  status: string;
  incrementLabel: string;
  activatedAt: Date | null;
  expireDate: Date | null;
  nextPayoutAt: Date;
  isActive: boolean;
};

export async function getAdminUserInvestmentPlans(options?: {
  activeOnly?: boolean;
}): Promise<AdminUserPlanRow[]> {
  const where =
    options?.activeOnly === true ? { status: "yes" as const } : undefined;

  const rows = await db.userInvestmentPlan.findMany({
    where,
    include: {
      plan: true,
      user: { select: { id: true, name: true, email: true, tradeMode: true } },
    },
    orderBy: [{ status: "asc" }, { activatedAt: "desc" }],
  });

  const now = new Date();

  return rows.map((row) => {
    const last =
      row.lastGrowth ?? row.activatedAt ?? row.createdAt ?? now;
    const nextPayoutAt = nextGrowthAfter(last, row.plan.incrementInterval);

    return {
      id: row.id,
      userId: row.userId,
      userName: row.user.name ?? "—",
      userEmail: row.user.email,
      planName: row.plan.name,
      amount: row.amount,
      profitEarned: row.profitEarned,
      status: row.status,
      incrementLabel: `${row.plan.incrementAmount}% ${row.plan.incrementInterval}`,
      activatedAt: row.activatedAt,
      expireDate: row.expireDate,
      nextPayoutAt,
      isActive: row.status === "yes",
    };
  });
}

export function summarizeAdminPlans(rows: AdminUserPlanRow[]) {
  const active = rows.filter((r) => r.isActive);
  return {
    activeCount: active.length,
    totalRows: rows.length,
    activePrincipal: active.reduce((s, r) => s + r.amount, 0),
    activeProfitEarned: active.reduce((s, r) => s + r.profitEarned, 0),
  };
}
