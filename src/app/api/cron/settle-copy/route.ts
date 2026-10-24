import { settleDueTrades } from "@/lib/copy-trading/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await settleDueTrades();
  return NextResponse.json(result);
}
