import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PageIcons } from "@/lib/icons/page-icons";
import { CopyTradersClient } from "./CopyTradersClient";
import { settleDueTrades } from "@/lib/copy-trading/service";

export default async function CopyTradingPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  await settleDueTrades(session.userId);

  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (settings && !settings.enableCopyTrading) {
    redirect("/dashboard");
  }

  const [traders, subscriptions] = await Promise.all([
    db.trader.findMany({ where: { isActive: true }, orderBy: { followers: "desc" } }),
    db.copySubscription.findMany({
      where: { userId: session.userId, status: "ACTIVE" },
      include: { trader: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.copy}
        title="Copy trading"
        description="Browse verified traders, set your allocation, and mirror timed signals automatically."
      />
      <CopyTradersClient traders={traders} subscriptions={subscriptions} />
    </div>
  );
}
