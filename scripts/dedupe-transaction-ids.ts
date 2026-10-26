/**
 * Remove duplicate Transaction.transactionId rows (keeps earliest createdAt).
 * Reverses wallet / profit balances for deleted duplicate ROI rows.
 *
 * Run before `npm run db:push` when adding the unique constraint on transactionId.
 */
import { PrismaClient } from "../src/generated/prisma";

const db = new PrismaClient();

async function main() {
  const dupes = await db.$queryRaw<
    { transactionId: string; c: bigint }[]
  >`SELECT "transactionId", COUNT(*)::bigint AS c
    FROM "Transaction"
    GROUP BY "transactionId"
    HAVING COUNT(*) > 1`;

  if (dupes.length === 0) {
    console.log("No duplicate transactionId values.");
    return;
  }

  console.log(`Found ${dupes.length} duplicated transactionId(s).`);

  for (const { transactionId } of dupes) {
    const rows = await db.transaction.findMany({
      where: { transactionId },
      orderBy: { createdAt: "asc" },
    });
    const [keep, ...remove] = rows;
    if (!keep || remove.length === 0) continue;

    console.log(
      `  ${transactionId}: keep ${keep.id}, remove ${remove.length}`,
    );

    for (const row of remove) {
      await db.$transaction(async (tx) => {
        await tx.transaction.delete({ where: { id: row.id } });

        if (row.type === "ROI" && row.postType === "profit") {
          await tx.user.update({
            where: { id: row.userId },
            data: {
              walletBalance: { decrement: row.amount },
              profitBalance: { decrement: row.amount },
              roiTotal: { decrement: row.amount },
            },
          });
          if (row.userPlanId) {
            await tx.userInvestmentPlan.updateMany({
              where: { id: row.userPlanId },
              data: { profitEarned: { decrement: row.amount } },
            });
          }
        }
      });
    }
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
