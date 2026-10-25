import { runAutomaticRoi } from "@/lib/investment/roi-cron";

/** Credit due ROI for one user (safe to call on dashboard/plans load). */
export async function syncUserRoi(userId: string) {
  return runAutomaticRoi(userId);
}
