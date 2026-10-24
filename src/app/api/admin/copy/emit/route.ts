import { getAdminSession } from "@/lib/admin-auth";
import { emitTraderTrades } from "@/lib/copy-trading/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { traderId?: number };
  if (!body.traderId) {
    return NextResponse.json({ error: "traderId required" }, { status: 400 });
  }

  try {
    const result = await emitTraderTrades(body.traderId);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Emit failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
