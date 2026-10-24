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
import type { RoiPaymentView, UserPlanView } from "@/lib/investment/user-plans";
import Link from "next/link";

function money(n: number, currency: string) {
  return `${currency}${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function payoutProgress(plan: UserPlanView) {
  if (!plan.isActive || !plan.lastGrowth) return 0;
  const start = new Date(plan.lastGrowth).getTime();
  const end = new Date(plan.nextPayoutAt).getTime();
  const now = Date.now();
  if (end <= start) return 100;
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}

export function ActivePlansSection({
  plans,
  roiHistory,
  currency,
  roiTotal,
}: {
  plans: UserPlanView[];
  roiHistory: RoiPaymentView[];
  currency: string;
  roiTotal: number;
}) {
  const active = plans.filter((p) => p.isActive);
  const past = plans.filter((p) => !p.isActive);

  return (
    <div id="my-plans" className="space-y-6 scroll-mt-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardPanel className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Active plans
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{active.length}</p>
        </DashboardPanel>
        <DashboardPanel className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Capital in plans
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-brand">
            {money(
              active.reduce((s, p) => s + p.amount, 0),
              currency,
            )}
          </p>
        </DashboardPanel>
        <DashboardPanel className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            ROI earned (plans)
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {money(
              active.reduce((s, p) => s + p.profitEarned, 0),
              currency,
            )}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Lifetime ROI credits: {money(roiTotal, currency)}
          </p>
        </DashboardPanel>
      </div>

      {active.length === 0 ? (
        <DashboardEmptyState
          title="No active investment plan"
          description="Browse tiers below and join with your wallet balance. ROI is credited automatically on each plan’s schedule."
        />
      ) : (
        <DashboardPanel>
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold">Active plans & ROI schedule</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Next payout times follow your plan interval (Hourly, Daily, Weekly,
              Monthly). ROI runs via the platform scheduler.
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Principal</TableHead>
                  <TableHead>ROI rate</TableHead>
                  <TableHead className="text-right">Earned</TableHead>
                  <TableHead>Next payout</TableHead>
                  <TableHead className="min-w-[120px]">Progress</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {active.map((plan) => {
                  const pct = payoutProgress(plan);
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.planName}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {money(plan.amount, currency)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {plan.incrementLabel}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                        {money(plan.profitEarned, currency)}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatWhen(plan.nextPayoutAt)}
                      </TableCell>
                      <TableCell>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                          {Math.round(pct)}% to next drop
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatWhen(plan.expireDate)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </DashboardPanel>
      )}

      {roiHistory.length > 0 ? (
        <DashboardPanel>
          <div className="border-b border-border px-4 py-3 sm:px-5 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">Recent ROI payments</h2>
              <p className="text-xs text-muted-foreground">
                Automatic credits to your wallet
              </p>
            </div>
            <Link
              href="/dashboard/transaction-history"
              className="text-xs font-medium text-brand hover:underline"
            >
              All transactions
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {roiHistory.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 text-sm"
              >
                <div>
                  <p className="font-medium">{row.planName ?? "Investment plan"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatWhen(row.createdAt)}
                  </p>
                </div>
                <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  +{money(row.amount, currency)}
                </span>
              </li>
            ))}
          </ul>
        </DashboardPanel>
      ) : null}

      {past.length > 0 ? (
        <DashboardPanel>
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Closed / expired plans
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                {past.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.planName}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {plan.status}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {money(plan.amount, currency)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {money(plan.profitEarned, currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardPanel>
      ) : null}
    </div>
  );
}
