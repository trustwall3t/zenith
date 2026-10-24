import { getSession } from "@/lib/session";
import { startCopying } from "@/lib/copy-trading/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    traderId?: number;
    allocation?: number;
  };
  if (!body.traderId || !body.allocation) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const sub = await startCopying(
      session.userId,
      body.traderId,
      body.allocation,
    );
    return NextResponse.json({ subscription: sub });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to subscribe";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
