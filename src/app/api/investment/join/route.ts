import { getSession } from "@/lib/session";
import { joinInvestmentPlan } from "@/lib/investment/join-plan";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { planId?: number; amount?: number };
  if (!body.planId || !body.amount) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const plan = await joinInvestmentPlan(
      session.userId,
      body.planId,
      body.amount,
    );
    return NextResponse.json({ plan });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not join plan";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
