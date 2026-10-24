import { PageHeader } from "@/components/dashboard/PageHeader";
import { PageIcons } from "@/lib/icons/page-icons";
import {
  DashboardEmptyState,
  DashboardPanel,
} from "@/components/dashboard/DashboardPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { TradeOutcomeBadge } from "@/components/trading/TradeOutcomeBadge";
import { formatTradePl } from "@/lib/trading/trade-outcome";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TradingHistoryPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const trades = await db.copyTrade.findMany({
    where: { userId: session.userId },
    orderBy: [{ openedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.tradingHistory}
        title="Trading history"
        description="Self-trades and copy trades — open and closed."
      />
      {trades.length === 0 ? (
        <DashboardEmptyState
          title="No trades yet"
          description="When you place trades on Live trading, they appear here immediately."
        />
      ) : (
        <DashboardPanel>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Opened</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Stake</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {(t.openedAt ?? t.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{t.assetSymbol}</TableCell>
                    <TableCell>
                      <span
                        className={
                          t.direction === "up"
                            ? "text-brand"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {t.direction === "up" ? "Up" : "Down"}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      ${Number(t.stake).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <TradeOutcomeBadge status={t.status} />
                    </TableCell>
                    <TableCell
                      className={cn(
                        "tabular-nums font-medium",
                        t.status === "won" &&
                          "text-emerald-600 dark:text-emerald-400",
                        t.status === "lost" &&
                          "text-red-600 dark:text-red-400",
                      )}
                    >
                      {formatTradePl(
                        t.status,
                        t.profit != null ? Number(t.profit) : null,
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {t.traderName ? `Copy · ${t.traderName}` : "Self trade"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardPanel>
      )}
    </div>
  );
}
