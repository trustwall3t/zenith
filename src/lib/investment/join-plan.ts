import { db } from "@/lib/db";
import { initialLastGrowth } from "@/lib/investment/roi-schedule";
import { revalidatePath } from "next/cache";

export async function joinInvestmentPlan(
  userId: string,
  planId: number,
  amount: number,
) {
  const [user, plan, settings] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.investmentPlan.findUnique({ where: { id: planId } }),
    db.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  if (!user || !plan) throw new Error("Invalid user or plan.");
  if (!settings?.tradeMode || user.tradeMode !== "on") {
    throw new Error("Trading is disabled.");
  }
  if (amount < plan.minPrice || amount > plan.maxPrice) {
    throw new Error(
      `Amount must be between ${plan.minPrice} and ${plan.maxPrice}.`,
    );
  }
  const balance = user.walletBalance ?? 0;
  if (balance < amount) throw new Error("Insufficient wallet balance.");

  const now = new Date();
  const lastGrowth = initialLastGrowth(plan.incrementInterval, now);
  let expireDate: Date | null = null;
  if (plan.expiration) {
    const days = parseInt(plan.expiration.replace(/\D/g, ""), 10);
    if (Number.isFinite(days) && days > 0) {
      expireDate = new Date(now.getTime() + days * 86400000);
    }
  }

  return db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        walletBalance: balance - amount,
        investmentBalance: (user.investmentBalance ?? 0) + amount,
      },
    });

    const userPlan = await tx.userInvestmentPlan.create({
      data: {
        userId,
        planId,
        amount,
        status: "yes",
        invDuration: plan.expiration,
        activatedAt: now,
        expireDate,
        lastGrowth,
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        paymentMethod: "wallet",
        transactionId: `plan-${userPlan.id}`,
        status: "success",
        transactionType: "Plan purchase",
        postType: "debit",
        amount,
        type: "Plan purchase",
        planName: plan.name,
        userPlanId: userPlan.id,
      },
    });

    if (plan.gift && plan.gift > 0) {
      await tx.transaction.create({
        data: {
          userId,
          paymentMethod: "system",
          transactionId: `gift-${userPlan.id}`,
          status: "success",
          transactionType: "Gift Bonus",
          postType: "credit",
          amount: plan.gift,
          type: "Gift Bonus",
          planName: plan.name,
        },
      });
    }

    return userPlan;
  }).then((userPlan) => {
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");
    return userPlan;
  });
}
