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
  getAdminRoiRecords,
  getAdminUserInvestmentPlans,
  summarizeAdminPlans,
  summarizeAdminRoiRecords,
} from "@/lib/investment/admin-plans";
import { db } from "@/lib/db";
import { GoogleTranslateToggle } from "./GoogleTranslateToggle";
import { RunCronClient } from "./RunCronClient";
import { RoiRecordsTable } from "./RoiRecordsTable";
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

function PlansTable({
  rows,
}: {
  rows: Awaited<ReturnType<typeof getAdminUserInvestmentPlans>>;
}) {
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
              <TableHead className="text-right">Actions</TableHead>
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
                  {row.isActive && row.userTradeMode !== "on" ? (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                      User trade mode off
                    </p>
                  ) : null}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/admin/dashboard/plans?plan=${row.id}`}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    ROI history
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardPanel>
  );
}

export default async function AdminInvestmentPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const planFilter = params.plan?.trim() || undefined;

  const [allPlans, activePlans, settings, roiRecords, roiActiveOnly] =
    await Promise.all([
      getAdminUserInvestmentPlans(),
      getAdminUserInvestmentPlans({ activeOnly: true }),
      db.siteSettings.findUnique({ where: { id: "default" } }),
      planFilter
        ? getAdminRoiRecords({ userPlanId: planFilter, limit: 500 })
        : getAdminRoiRecords({ limit: 250 }),
      getAdminRoiRecords({ activePlansOnly: true, limit: 250 }),
    ]);

  const activeSummary = summarizeAdminPlans(allPlans);
  const roiSummary = summarizeAdminRoiRecords(roiRecords);
  const roiActiveSummary = summarizeAdminRoiRecords(roiActiveOnly);
  const filteredPlan = planFilter
    ? allPlans.find((p) => p.id === planFilter)
    : undefined;
  const defaultTab = planFilter ? "roi" : "active";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.investmentPlans}
        title="Investment plans"
        description="Active user plans, ROI payment ledger, and manual cron for local or emergency runs."
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

      <div className="space-y-2 text-xs text-muted-foreground">
        <p>
          Global trade mode:{" "}
          <span className="font-medium text-foreground">
            {settings?.tradeMode ? "On" : "Off"}
          </span>
          {settings && !settings.tradeMode ? (
            <span> — automatic ROI will not credit until enabled in site settings.</span>
          ) : null}
        </p>
        <GoogleTranslateToggle enabled={settings?.googleTranslate ?? true} />
      </div>

      <Tabs defaultValue={defaultTab} key={defaultTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active ({activePlans.length})
          </TabsTrigger>
          <TabsTrigger value="roi">ROI records</TabsTrigger>
          <TabsTrigger value="all">All plans ({allPlans.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <PlansTable rows={activePlans} />
        </TabsContent>
        <TabsContent value="roi" className="mt-4 space-y-4">
          {filteredPlan ? (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">
                  ROI for {filteredPlan.userName} — {filteredPlan.planName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Principal {formatMoney(filteredPlan.amount)} · Earned on plan{" "}
                  {formatMoney(filteredPlan.profitEarned)} · {filteredPlan.incrementLabel}
                </p>
              </div>
              <Link
                href="/admin/dashboard/plans"
                className="text-xs font-medium text-brand hover:underline"
              >
                Clear filter
              </Link>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
              <p className="font-medium">Recent ROI payments</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest platform-wide ROI credits (up to 250). Active-plan ROI
                total in view: {formatMoney(roiActiveSummary.totalAmount)} (
                {roiActiveSummary.count} rows). Use{" "}
                <span className="font-medium">ROI history</span> on a plan row to
                filter one subscription.
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{roiSummary.count}</strong>{" "}
              payments
            </span>
            <span>
              Total{" "}
              <strong className="text-foreground tabular-nums">
                {formatMoney(roiSummary.totalAmount)}
              </strong>
            </span>
          </div>
          <RoiRecordsTable
            rows={roiRecords}
            emptyTitle={
              planFilter ? "No ROI for this plan" : "No ROI payments yet"
            }
            emptyDescription={
              planFilter
                ? "This subscription has not received automatic ROI credits yet, or trade mode was off."
                : "When automatic ROI runs, successful credits appear here."
            }
          />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <PlansTable rows={allPlans} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
