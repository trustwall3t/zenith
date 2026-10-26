import { sendPlanClosedEmail, sendRoiEmail } from "@/lib/email/zenith-notifications";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma";
import {
  computeIncrement,
  isWeekend,
  maxCatchupForInterval,
  nextGrowthAfter,
  resolvePlanLastGrowth,
} from "@/lib/investment/roi-schedule";

export type RoiCronResult = {
  credited: number;
  skipped: number;
  expired: number;
  weekendSkipped: number;
};

type RoiDropOutcome =
  | { kind: "not_due" }
  | { kind: "weekend_skip" }
  | { kind: "already_paid" }
  | { kind: "credited" };

async function applyOneRoiDrop(args: {
  userPlanId: string;
  userId: string;
  planName: string;
  planInterval: string;
  increment: number;
  now: Date;
  weekendTrade: boolean;
  activatedAt: Date | null;
  createdAt: Date;
}): Promise<RoiDropOutcome> {
  const {
    userPlanId,
    userId,
    planName,
    planInterval,
    increment,
    now,
    weekendTrade,
    activatedAt,
    createdAt,
  } = args;

  try {
    return await db.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<
        {
          lastGrowth: Date | null;
          profitEarned: number;
        }[]
      >`
        SELECT "lastGrowth", "profitEarned"
        FROM "UserInvestmentPlan"
        WHERE id = ${userPlanId}
        FOR UPDATE
      `;
      const planRow = locked[0];
      if (!planRow) {
        return { kind: "not_due" };
      }

      const lastGrowth = resolvePlanLastGrowth(
        {
          lastGrowth: planRow.lastGrowth,
          activatedAt,
          createdAt,
          profitEarned: planRow.profitEarned,
        },
        planInterval,
      );

      const nextDrop = nextGrowthAfter(lastGrowth, planInterval);
      if (now < nextDrop) {
        return { kind: "not_due" };
      }

      if (isWeekend(nextDrop) && !weekendTrade) {
        await tx.userInvestmentPlan.update({
          where: { id: userPlanId },
          data: { lastGrowth: nextDrop },
        });
        return { kind: "weekend_skip" };
      }

      const transactionId = `roi-${userPlanId}-${nextDrop.getTime()}`;
      const existing = await tx.transaction.findUnique({
        where: { transactionId },
        select: { id: true },
      });
      if (existing) {
        const stored = planRow.lastGrowth?.getTime() ?? 0;
        if (stored < nextDrop.getTime()) {
          await tx.userInvestmentPlan.update({
            where: { id: userPlanId },
            data: { lastGrowth: nextDrop },
          });
        }
        return { kind: "already_paid" };
      }

      await tx.transaction.create({
        data: {
          userId,
          paymentMethod: "system",
          transactionId,
          status: "success",
          transactionType: "ROI",
          postType: "profit",
          amount: increment,
          type: "ROI",
          planName,
          userPlanId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment },
          profitBalance: { increment },
          roiTotal: { increment },
        },
      });

      await tx.userInvestmentPlan.update({
        where: { id: userPlanId },
        data: {
          lastGrowth: nextDrop,
          profitEarned: { increment },
        },
      });

      return { kind: "credited" };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { kind: "already_paid" };
    }
    throw error;
  }
}

/**
 * Automatic ROI — port of Zenith `AutoTaskController::automaticRoi`.
 * Runs when global `SiteSettings.tradeMode` is on and user `tradeMode` is on.
 */
export async function runAutomaticRoi(userId?: string): Promise<RoiCronResult> {
  const result: RoiCronResult = {
    credited: 0,
    skipped: 0,
    expired: 0,
    weekendSkipped: 0,
  };

  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings?.tradeMode) {
    return result;
  }

  const now = new Date();
  const activePlans = await db.userInvestmentPlan.findMany({
    where: {
      status: "yes",
      ...(userId ? { userId } : {}),
    },
    include: { plan: true, user: true },
  });

  for (const row of activePlans) {
    const user = row.user;
    const dplan = row.plan;
    if (!user || !dplan) {
      result.skipped++;
      continue;
    }
    if (user.tradeMode !== "on") {
      result.skipped++;
      continue;
    }

    const planInterval = dplan.incrementInterval;
    const maxCatchup = maxCatchupForInterval(planInterval);
    const increment = computeIncrement(
      row.amount,
      dplan.incrementAmount,
      dplan.incrementType,
    );

    const expireDate = row.expireDate;
    const stillActive = expireDate ? now <= expireDate : true;
    const isExpired = expireDate ? now > expireDate : false;

    if (stillActive) {
      let creditedThisPlan = 0;
      let catchup = 0;

      while (catchup < maxCatchup) {
        const outcome = await applyOneRoiDrop({
          userPlanId: row.id,
          userId: user.id,
          planName: dplan.name,
          planInterval,
          increment,
          now,
          weekendTrade: settings.weekendTrade,
          activatedAt: row.activatedAt,
          createdAt: row.createdAt,
        });

        if (outcome.kind === "not_due") {
          break;
        }

        catchup++;

        if (outcome.kind === "weekend_skip") {
          result.weekendSkipped++;
          continue;
        }

        if (outcome.kind === "already_paid") {
          continue;
        }

        creditedThisPlan++;
        result.credited++;
      }

      if (user.sendRoiEmail && creditedThisPlan > 0) {
        await sendRoiEmail({
          to: user.email,
          name: user.name,
          planName: dplan.name,
          amount: increment * creditedThisPlan,
          currency: settings.currency,
        }).catch(() => undefined);
      }
      continue;
    }

    if (isExpired) {
      await db.$transaction(async (tx) => {
        if (settings.returnCapital) {
          await tx.user.update({
            where: { id: user.id },
            data: {
              walletBalance: (user.walletBalance ?? 0) + row.amount,
            },
          });
          await tx.transaction.create({
            data: {
              userId: user.id,
              paymentMethod: "system",
              transactionId: `capital-${row.id}-${now.getTime()}`,
              status: "success",
              transactionType: "Investment capital",
              postType: "credit",
              amount: row.amount,
              type: "Investment capital",
              planName: dplan.name,
              userPlanId: row.id,
            },
          });
        }
        await tx.user.update({
          where: { id: user.id },
          data: {
            investmentBalance: Math.max(
              0,
              (user.investmentBalance ?? 0) - row.amount,
            ),
          },
        });
        await tx.userInvestmentPlan.update({
          where: { id: row.id },
          data: { status: "expired" },
        });
      });

      if (user.sendPlanClosedEmail) {
        await sendPlanClosedEmail({
          to: user.email,
          name: user.name,
          planName: dplan.name,
          amount: row.amount,
          currency: settings.currency,
          siteName: settings.siteName,
        }).catch(() => undefined);
      }
      result.expired++;
    }
  }

  return result;
}
