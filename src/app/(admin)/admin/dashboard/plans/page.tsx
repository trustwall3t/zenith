import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
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
import {
  getAdminUserInvestmentPlans,
  summarizeAdminPlans,
} from "@/lib/investment/admin-plans";
import { db } from "@/lib/db";
import { RunCronClient } from "./RunCronClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function PlansTable({ rows }: { rows: Awaited<ReturnType<typeof getAdminUserInvestmentPlans>> }) {
  if (rows.length === 0) {
    return (
      <DashboardEmptyState
        title="No investment plans"
        description="When users join plans, they will appear here."
      />
    );
  }

  return (
    <DashboardPanel>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">ROI earned</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Next payout</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={`/admin/dashboard/users/${row.userId}`}
                    className="font-medium hover:text-brand"
                  >
                    {row.userName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{row.userEmail}</p>
                </TableCell>
                <TableCell>{row.planName}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(row.amount)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-brand">
                  +{formatMoney(row.profitEarned)}
                </TableCell>
                <TableCell className="text-xs">{row.incrementLabel}</TableCell>
                <TableCell className="text-xs whitespace-nowrap">
                  {row.isActive ? formatDate(row.nextPayoutAt) : "—"}
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap">
                  {formatDate(row.expireDate)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      row.isActive
                        ? "text-brand text-xs font-medium"
                        : "text-muted-foreground text-xs"
                    }
                  >
                    {row.isActive ? "Active" : row.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardPanel>
  );
}

export default async function AdminInvestmentPlansPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const [allPlans, activePlans, settings] = await Promise.all([
    getAdminUserInvestmentPlans(),
    getAdminUserInvestmentPlans({ activeOnly: true }),
    db.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const activeSummary = summarizeAdminPlans(allPlans);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.investmentPlans}
        title="Investment plans"
        description="Active user plans, ROI performance, and manual cron for local or emergency runs."
      />

      <RunCronClient />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Active plans</p>
          <p className="text-2xl font-semibold tabular-nums">
            {activeSummary.activeCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Active principal</p>
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(activeSummary.activePrincipal)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Total ROI paid (on plans)</p>
          <p className="text-2xl font-semibold tabular-nums text-brand">
            {formatMoney(activeSummary.activeProfitEarned)}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Global trade mode:{" "}
        <span className="font-medium text-foreground">
          {settings?.tradeMode ? "On" : "Off"}
        </span>
        {settings && !settings.tradeMode ? (
          <span> — automatic ROI will not credit until enabled in site settings.</span>
        ) : null}
      </p>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activePlans.length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({allPlans.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <PlansTable rows={activePlans} />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <PlansTable rows={allPlans} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
