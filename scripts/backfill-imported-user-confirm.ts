/**
 * Zenith import sets isVerified but not confirm; signup flow expects confirm === 'true'.
 * Run once after import: npm run backfill:user-confirm
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      OR: [{ zenithId: { not: null } }, { isVerified: true }],
      NOT: { confirm: "true" },
    },
    data: { confirm: "true" },
  });
  console.log(`Updated confirm='true' for ${result.count} user(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
