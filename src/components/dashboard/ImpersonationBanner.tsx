"use client";

import { exitUserImpersonation } from "@/actions/admin/impersonateUser";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useTransition } from "react";

type Props = {
  memberName: string;
  memberId: string;
};

export function ImpersonationBanner({ memberName, memberId }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-brand/40 bg-brand/10 p-4 text-foreground sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium flex items-center gap-2">
        <Shield className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
        Admin view — signed in as{" "}
        <span className="font-semibold">{memberName}</span>
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit shrink-0 border-brand/50 bg-background"
        disabled={pending}
        onClick={() => {
          startTransition(() => exitUserImpersonation(memberId));
        }}
      >
        {pending ? "Leaving…" : "Exit to admin"}
      </Button>
    </div>
  );
}
