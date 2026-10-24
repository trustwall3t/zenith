"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { runScheduledJobsAdmin } from "@/actions/admin/runScheduledJobs";
import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";

export function RunCronClient() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [lastResult, setLastResult] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
      <div className="text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Automatic ROI & copy settlement</p>
        <p className="mt-0.5 text-xs">
          Production: Vercel cron hits{" "}
          <code className="rounded bg-muted px-1">/api/cron/run-all</code> once
          daily (00:00 UTC) when deployed with{" "}
          <code className="rounded bg-muted px-1">CRON_SECRET</code>. Use Run
          jobs now for immediate ROI settlement or copy trade closure locally or
          between cron runs.
        </p>
        {lastResult ? (
          <p className="mt-2 text-xs font-mono text-brand">{lastResult}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={pending}
        className="shrink-0"
        onClick={() => {
          startTransition(async () => {
            setLastResult(null);
            const res = await runScheduledJobsAdmin();
            if (!res.ok) {
              setLastResult(res.error);
              return;
            }
            setLastResult(
              `Ran at ${new Date(res.at).toLocaleString()} · ROI credited: ${res.roi.credited}, expired: ${res.roi.expired}, skipped: ${res.roi.skipped} · Copy settled: ${res.copy.settled}`,
            );
            router.refresh();
          });
        }}
      >
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        Run jobs now
      </Button>
    </div>
  );
}
