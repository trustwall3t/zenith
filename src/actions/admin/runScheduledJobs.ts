"use server";

import { getAdminSession } from "@/lib/admin-auth";
import { settleDueTrades } from "@/lib/copy-trading/service";
import { runAutomaticRoi } from "@/lib/investment/roi-cron";

export type RunScheduledJobsResult =
  | {
      ok: true;
      at: string;
      copy: { settled: number; failed: number };
      roi: {
        credited: number;
        skipped: number;
        expired: number;
        weekendSkipped: number;
      };
    }
  | { ok: false; error: string };

export async function runScheduledJobsAdmin(): Promise<RunScheduledJobsResult> {
  const admin = await getAdminSession();
  if (!admin) {
    return { ok: false, error: "Unauthorized" };
  }

  const [copy, roi] = await Promise.all([
    settleDueTrades(),
    runAutomaticRoi(),
  ]);

  return {
    ok: true,
    at: new Date().toISOString(),
    copy,
    roi,
  };
}
