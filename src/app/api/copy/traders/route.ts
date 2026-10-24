import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (settings && !settings.enableCopyTrading) {
    return NextResponse.json({ traders: [], enabled: false });
  }

  const traders = await db.trader.findMany({
    where: { isActive: true },
    orderBy: { followers: "desc" },
  });

  return NextResponse.json({ traders, enabled: true });
}
