import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CopyTradersAdminClient } from "./CopyTradersAdminClient";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PageIcons } from "@/lib/icons/page-icons";
import { CopySubscriptionStatus } from "@/generated/prisma";
import type { AdminTraderRow } from "@/actions/admin/copyTraders";

export const dynamic = "force-dynamic";

export default async function AdminCopyTradersPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const [traders, copierGroups, settings] = await Promise.all([
    db.trader.findMany({ orderBy: { id: "asc" } }),
    db.copySubscription.groupBy({
      by: ["traderId"],
      where: { status: CopySubscriptionStatus.ACTIVE },
      _count: { _all: true },
    }),
    db.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const copiersByTrader = new Map(
    copierGroups.map((g) => [g.traderId, g._count._all]),
  );

  const rows: AdminTraderRow[] = traders.map((t) => ({
    id: t.id,
    name: t.name,
    market: t.market,
    description: t.description,
    strategy: t.strategy,
    winRate: t.winRate != null ? Number(t.winRate) : null,
    followers: t.followers,
    totalTrades: t.totalTrades,
    isActive: t.isActive,
    activeCopiers: copiersByTrader.get(t.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.copyTraders}
        title="Copy traders"
        description="Create trader profiles and emit signals to users who copy them."
      />
      {settings && !settings.enableCopyTrading ? (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
          Copy trading is disabled in site settings. Users cannot subscribe until
          you enable it.
        </p>
      ) : null}
      <CopyTradersAdminClient traders={rows} />
    </div>
  );
}
