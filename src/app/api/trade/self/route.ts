import { getSession } from "@/lib/session";
import { placeSelfTrade } from "@/lib/copy-trading/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    symbol?: string;
    market?: string;
    direction?: "up" | "down";
    durationSeconds?: number;
    stake?: number;
  };

  try {
    const trade = await placeSelfTrade(
      session.userId,
      body.symbol ?? "BTC",
      body.market ?? "CRYPTO",
      body.direction ?? "up",
      body.durationSeconds ?? 900,
      body.stake ?? 0,
    );
    return NextResponse.json({ trade });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Trade failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
