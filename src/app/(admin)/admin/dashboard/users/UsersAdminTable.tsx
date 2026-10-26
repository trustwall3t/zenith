"use client";

import BalanceForm from "@/app/(admin)/components/form/BalanceForm";
import {
  deleteUserById,
  setUserDisabled,
  setUserTradeMode,
  setUserVerified,
} from "@/actions/admin/manageUser";
import { sendUserEmail } from "@/actions/admin/sendUserEmail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Ban,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { AdminLoginAsUserButton } from "@/components/admin/AdminLoginAsUserButton";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  walletBalance: number | null;
  profitBalance: number | null;
  investmentBalance: number | null;
  refcode: string | null;
  isVerified: boolean;
  isDisabled: boolean;
  tradeMode: string;
  createdAt: string;
  kycStatus: string | null;
};

function money(n: number | null | undefined) {
  return `$${(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function StatusBadge({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "danger" | "muted";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        tone === "ok" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        tone === "warn" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
        tone === "danger" && "bg-red-500/10 text-red-700 dark:text-red-400",
        tone === "muted" && "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function UsersAdminTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [manageUser, setManageUser] = useState<AdminUserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        (u.refcode?.toLowerCase().includes(q) ?? false) ||
        u.country.toLowerCase().includes(q),
    );
  }, [users, query]);

  const balanceFormUser = manageUser
    ? {
        id: manageUser.id,
        name: manageUser.name,
        email: manageUser.email,
        phone: manageUser.phone,
        walletBalance: manageUser.walletBalance,
        refcode: manageUser.refcode,
        isVerified: manageUser.isVerified,
        createdAt: new Date(manageUser.createdAt),
        profitBalance: manageUser.profitBalance,
        investmentBalance: manageUser.investmentBalance,
      }
    : null;

  function runAction(label: string, fn: () => Promise<{ error?: string; success?: boolean }>) {
    startTransition(async () => {
      try {
        const res = await fn();
        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(label);
        router.refresh();
      } catch {
        toast.error("Action failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, country, ref code…"
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          {filtered.length} of {users.length} users
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[220px]">Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Wallet</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Invested</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Profit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => {
                const kyc = user.kycStatus?.toLowerCase();
                return (
                  <TableRow key={user.id} className="align-top">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                          {initials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          {user.refcode ? (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Ref: {user.refcode}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <p>{user.phone}</p>
                      <p className="text-xs text-muted-foreground">{user.country}</p>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-brand">
                      {money(user.walletBalance)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums hidden lg:table-cell">
                      {money(user.investmentBalance)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums hidden lg:table-cell">
                      {money(user.profitBalance)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.isDisabled ? (
                          <StatusBadge tone="danger">Disabled</StatusBadge>
                        ) : (
                          <StatusBadge tone="ok">Active</StatusBadge>
                        )}
                        {user.isVerified ? (
                          <StatusBadge tone="ok">Verified</StatusBadge>
                        ) : (
                          <StatusBadge tone="warn">Unverified</StatusBadge>
                        )}
                        {kyc === "approved" || kyc === "success" ? (
                          <StatusBadge tone="ok">KYC OK</StatusBadge>
                        ) : kyc === "pending" ? (
                          <StatusBadge tone="warn">KYC pending</StatusBadge>
                        ) : (
                          <StatusBadge tone="muted">No KYC</StatusBadge>
                        )}
                        {user.tradeMode === "off" ? (
                          <StatusBadge tone="warn">Trade off</StatusBadge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => {
                          setManageUser(user);
                          setEmailSubject("");
                          setEmailMessage("");
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!manageUser} onOpenChange={(o) => !o && setManageUser(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {manageUser ? (
            <>
              <SheetHeader className="text-left pb-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-brand" />
                  {manageUser.name}
                </SheetTitle>
                <SheetDescription>{manageUser.email}</SheetDescription>
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="rounded-lg border border-border bg-muted/30 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Wallet</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {money(manageUser.walletBalance)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Invest</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {money(manageUser.investmentBalance)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Profit</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {money(manageUser.profitBalance)}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="wallet" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="wallet" className="gap-1 text-xs sm:text-sm">
                    <Wallet className="h-3.5 w-3.5" />
                    Funds
                  </TabsTrigger>
                  <TabsTrigger value="email" className="gap-1 text-xs sm:text-sm">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="account" className="gap-1 text-xs sm:text-sm">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="wallet" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Credit or debit wallet, profit, and investment balances. Uncheck
                    Credit to debit.
                  </p>
                  <BalanceForm user={balanceFormUser} />
                  <Button asChild variant="link" className="px-0 h-auto text-brand">
                    <Link
                      href={`/admin/dashboard/livetrade?userId=${manageUser.id}`}
                    >
                      Open live trade tools for this user →
                    </Link>
                  </Button>
                </TabsContent>

                <TabsContent value="email" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email-subject">Subject</Label>
                    <Input
                      id="admin-email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Account update"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email-body">Message</Label>
                    <textarea
                      id="admin-email-body"
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={6}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      placeholder="Write your message to the member…"
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={pending || !emailSubject.trim() || !emailMessage.trim()}
                    onClick={() =>
                      runAction("Email sent", () =>
                        sendUserEmail({
                          userId: manageUser.id,
                          subject: emailSubject.trim(),
                          message: emailMessage.trim(),
                        }),
                      )
                    }
                  >
                    Send email
                  </Button>
                </TabsContent>

                <TabsContent value="account" className="mt-4 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    disabled={pending}
                    onClick={() =>
                      runAction(
                        manageUser.isDisabled ? "User enabled" : "User disabled",
                        () =>
                          setUserDisabled(manageUser.id, !manageUser.isDisabled),
                      )
                    }
                  >
                    {manageUser.isDisabled ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                    {manageUser.isDisabled ? "Enable account" : "Disable account"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    disabled={pending}
                    onClick={() =>
                      runAction(
                        manageUser.isVerified ? "Marked unverified" : "Marked verified",
                        () =>
                          setUserVerified(manageUser.id, !manageUser.isVerified),
                      )
                    }
                  >
                    <ShieldOff className="h-4 w-4" />
                    {manageUser.isVerified ? "Mark unverified" : "Mark verified"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    disabled={pending}
                    onClick={() =>
                      runAction(
                        manageUser.tradeMode === "off"
                          ? "Trading enabled"
                          : "Trading disabled",
                        () =>
                          setUserTradeMode(
                            manageUser.id,
                            manageUser.tradeMode === "off" ? "on" : "off",
                          ),
                      )
                    }
                  >
                    <TrendingUp className="h-4 w-4" />
                    {manageUser.tradeMode === "off"
                      ? "Enable trading"
                      : "Disable trading"}
                  </Button>

                  <AdminLoginAsUserButton
                    userId={manageUser.id}
                    variant="default"
                    fullWidth
                  />

                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/admin/dashboard/users/${manageUser.id}`}>
                      View full profile
                    </Link>
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => {
                      setDeleteTarget(manageUser);
                      setManageUser(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete user
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              This permanently removes {deleteTarget?.name} and their sessions. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => {
                if (!deleteTarget) return;
                startTransition(async () => {
                  await deleteUserById(deleteTarget.id);
                  toast.success("User deleted");
                  setDeleteTarget(null);
                  router.refresh();
                });
              }}
            >
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
