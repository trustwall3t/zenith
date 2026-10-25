import Link from "next/link";
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
import type { AdminRoiRecord } from "@/lib/investment/admin-plans";
import SuccessBadge from "@/app/(admin)/components/SuccessBadge";
import PendingBadge from "@/app/(admin)/components/PendingBadge";
import CancelledBadge from "@/app/(admin)/components/CancelledBadge";

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(d: Date) {
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "success") return <SuccessBadge />;
  if (s === "pending") return <PendingBadge />;
  return <CancelledBadge />;
}

export function RoiRecordsTable({
  rows,
  emptyTitle = "No ROI payments",
  emptyDescription = "Automatic ROI credits will appear here when plans pay out.",
}: {
  rows: AdminRoiRecord[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0) {
    return (
      <DashboardEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <DashboardPanel>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="font-mono text-xs">Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-xs whitespace-nowrap">
                  {formatDate(row.createdAt)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/dashboard/users/${row.userId}`}
                    className="font-medium hover:text-brand text-sm"
                  >
                    {row.userName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{row.userEmail}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{row.planName ?? "—"}</p>
                  {row.userPlanId ? (
                    <Link
                      href={`/admin/dashboard/plans?plan=${row.userPlanId}`}
                      className="text-[11px] text-brand hover:underline"
                    >
                      View plan ROI
                    </Link>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium text-brand">
                  +{formatMoney(row.amount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground max-w-[140px] truncate">
                  {row.transactionId}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardPanel>
  );
}
