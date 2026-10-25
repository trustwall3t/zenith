import { db } from "@/lib/db";
import {
  formatIncrementInterval,
  nextGrowthAfter,
  resolvePlanLastGrowth,
} from "@/lib/investment/roi-schedule";

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
  lastGrowth: Date | null;
  nextPayoutAt: Date;
  isActive: boolean;
  userTradeMode: string | null;
};

export type AdminRoiRecord = {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPlanId: string | null;
  planName: string | null;
  amount: number;
  status: string;
  createdAt: Date;
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

    return {
      id: row.id,
      userId: row.userId,
      userName: row.user.name ?? "—",
      userEmail: row.user.email,
      planName: row.plan.name,
      amount: row.amount,
      profitEarned: row.profitEarned,
      status: row.status,
      incrementLabel: `${row.plan.incrementAmount}% ${formatIncrementInterval(row.plan.incrementInterval)}`,
      activatedAt: row.activatedAt,
      expireDate: row.expireDate,
      lastGrowth: row.lastGrowth,
      nextPayoutAt,
      isActive: row.status === "yes",
      userTradeMode: row.user.tradeMode,
    };
  });
}

const ROI_TX_WHERE = {
  OR: [
    { transactionType: { equals: "ROI", mode: "insensitive" as const } },
    { type: { equals: "ROI", mode: "insensitive" as const } },
  ],
};

export async function getAdminRoiRecords(options?: {
  limit?: number;
  userPlanId?: string;
  /** Only ROI tied to currently active user plans */
  activePlansOnly?: boolean;
}): Promise<AdminRoiRecord[]> {
  const limit = options?.limit ?? 200;

  let userPlanIdFilter: { userPlanId?: string | { in: string[] } } = {};
  if (options?.userPlanId) {
    userPlanIdFilter = { userPlanId: options.userPlanId };
  } else if (options?.activePlansOnly) {
    const active = await db.userInvestmentPlan.findMany({
      where: { status: "yes" },
      select: { id: true },
    });
    const ids = active.map((r) => r.id);
    if (ids.length === 0) return [];
    userPlanIdFilter = { userPlanId: { in: ids } };
  }

  const rows = await db.transaction.findMany({
    where: {
      ...ROI_TX_WHERE,
      ...userPlanIdFilter,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((row) => ({
    id: row.id,
    transactionId: row.transactionId,
    userId: row.userId,
    userName: row.user.name ?? "—",
    userEmail: row.user.email,
    userPlanId: row.userPlanId,
    planName: row.planName,
    amount: row.amount,
    status: row.status,
    createdAt: row.createdAt,
  }));
}

export function summarizeAdminRoiRecords(rows: AdminRoiRecord[]) {
  return {
    count: rows.length,
    totalAmount: rows.reduce((s, r) => s + r.amount, 0),
  };
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
