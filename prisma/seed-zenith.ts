import { PrismaClient } from "../src/generated/prisma";
import { COPY_TRADING } from "../src/config/copy-trading";

const db = new PrismaClient();

async function main() {
  await db.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      siteName: "Apex Trade Zone",
      currency: "$",
      welcomeMessage:
        "Welcome to Apex Trade Zone — mirror trading and investment plans.",
      enableCopyTrading: true,
      enableSelfTrade: true,
      enableInvestmentPlans: true,
      enableKyc: true,
    },
    update: {},
  });

  for (const asset of COPY_TRADING.assets) {
    await db.copyAsset.upsert({
      where: { symbol: asset.symbol },
      create: {
        symbol: asset.symbol,
        name: asset.name,
        market: asset.market,
        externalId: asset.externalId,
      },
      update: {
        name: asset.name,
        market: asset.market,
        externalId: asset.externalId,
      },
    });
  }

  for (const t of COPY_TRADING.traders) {
    const existing = await db.trader.findFirst({ where: { name: t.name } });
    if (existing) continue;
    await db.trader.create({
      data: {
        name: t.name,
        description: t.description,
        strategy: t.strategy,
        market: t.market,
        winRate: t.winRate,
        followers: t.followers,
        totalTrades: t.totalTrades,
        isActive: true,
      },
    });
  }

  const planCount = await db.investmentPlan.count();
  if (planCount === 0) {
    await db.investmentPlan.createMany({
      data: [
        {
          name: "Starter",
          minPrice: 1000,
          maxPrice: 50000,
          incrementAmount: "22",
          incrementInterval: "Monthly",
          planType: "Main",
        },
        {
          name: "Tier I",
          minPrice: 51000,
          maxPrice: 100000,
          incrementAmount: "45.6",
          incrementInterval: "Monthly",
          planType: "Main",
        },
      ],
    });
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
