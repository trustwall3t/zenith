import { settleDueTrades } from "@/lib/copy-trading/service";
import { runAutomaticRoi } from "@/lib/investment/roi-cron";
import { NextResponse } from "next/server";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** Vercel cron (daily): copy settlement + automatic ROI with interval catch-up. */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [copy, roi] = await Promise.all([
    settleDueTrades(),
    runAutomaticRoi(),
  ]);

  return NextResponse.json({
    ok: true,
    at: new Date().toISOString(),
    copy,
    roi,
  });
}

export const POST = GET;
