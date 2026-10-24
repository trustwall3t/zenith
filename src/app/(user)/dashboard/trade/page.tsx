import { redirect } from "next/navigation";

/** Self-trade UX lives on the live trading terminal. */
export default function SelfTradeRedirectPage() {
  redirect("/dashboard/live-trading");
}
