import { db } from "@/lib/db";
import {
  computeIncrement,
  isWeekend,
  nextGrowthAfter,
} from "@/lib/investment/roi-schedule";
import { sendRoiEmail, sendPlanClosedEmail } from "@/lib/email/zenith-notifications";

export type RoiCronResult = {
  credited: number;
  skipped: number;
  expired: number;
  weekendSkipped: number;
};

/** Cap missed ROI payouts applied in one cron run (daily cron catch-up). */
const MAX_ROI_CATCHUP_PER_PLAN = 500;

/**
 * Automatic ROI — port of Zenith `AutoTaskController::automaticRoi`.
 * Runs when global `SiteSettings.tradeMode` is on and user `tradeMode` is on.
 */
export async function runAutomaticRoi(): Promise<RoiCronResult> {
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
    where: { status: "yes" },
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

    let lastGrowth = row.lastGrowth ?? row.activatedAt ?? row.createdAt;
    const expireDate = row.expireDate;
    const increment = computeIncrement(
      row.amount,
      dplan.incrementAmount,
      dplan.incrementType,
    );

    const stillActive = expireDate ? now <= expireDate : true;
    const isExpired = expireDate ? now > expireDate : false;

    if (stillActive) {
      let profitEarned = row.profitEarned;
      let catchup = 0;
      let walletBalance = user.walletBalance ?? 0;
      let profitBalance = user.profitBalance ?? 0;
      let roiTotal = user.roiTotal;
      let creditedThisPlan = 0;

      while (catchup < MAX_ROI_CATCHUP_PER_PLAN) {
        const nextDrop = nextGrowthAfter(lastGrowth, dplan.incrementInterval);
        if (now < nextDrop) break;

        if (isWeekend(nextDrop) && !settings.weekendTrade) {
          lastGrowth = nextDrop;
          result.weekendSkipped++;
          catchup++;
          continue;
        }

        walletBalance += increment;
        profitBalance += increment;
        roiTotal += increment;
        profitEarned += increment;
        lastGrowth = nextDrop;
        catchup++;

        await db.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: user.id },
            data: {
              roiTotal,
              walletBalance,
              profitBalance,
            },
          });
          await tx.transaction.create({
            data: {
              userId: user.id,
              paymentMethod: "system",
              transactionId: `roi-${row.id}-${lastGrowth.getTime()}-${catchup}`,
              status: "success",
              transactionType: "ROI",
              postType: "profit",
              amount: increment,
              type: "ROI",
              planName: dplan.name,
              userPlanId: row.id,
            },
          });
          await tx.userInvestmentPlan.update({
            where: { id: row.id },
            data: {
              lastGrowth,
              profitEarned,
            },
          });
        });

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
