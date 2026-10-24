import { getHomePayload } from "@/lib/public/home-payload";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const payload = await getHomePayload();
  return NextResponse.json(payload);
}
