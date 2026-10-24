import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PageIcons } from "@/lib/icons/page-icons";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { TradeOutcomeBadge } from "@/components/trading/TradeOutcomeBadge";
import { formatTradePl } from "@/lib/trading/trade-outcome";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CopyHistoryPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const trades = await db.copyTrade.findMany({
    where: { userId: session.userId },
    orderBy: { openedAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.copyHistory}
        title="Copy history"
        description="Open and closed copy/self trades."
      />
      <DashboardPanel>
        <ul className="divide-y divide-border">
          {trades.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="min-w-0">
                {t.assetSymbol}{" "}
                <span className="uppercase text-muted-foreground">
                  {t.direction}
                </span>
                {t.traderName ? ` · ${t.traderName}` : ""}
              </span>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <TradeOutcomeBadge status={t.status} />
                <span
                  className={cn(
                    "tabular-nums text-xs",
                    t.status === "won" &&
                      "font-semibold text-emerald-600 dark:text-emerald-400",
                    t.status === "lost" &&
                      "font-semibold text-red-600 dark:text-red-400",
                    t.status === "open" && "text-muted-foreground",
                  )}
                >
                  Stake ${Number(t.stake).toFixed(2)}
                  {t.status !== "open" && (
                    <> · {formatTradePl(t.status, Number(t.profit ?? 0))}</>
                  )}
                </span>
              </div>
            </li>
          ))}
          {trades.length === 0 ? (
            <li className="px-4 py-8 text-center text-muted-foreground">
              No trades yet.
            </li>
          ) : null}
        </ul>
      </DashboardPanel>
    </div>
  );
}
