import { syncTrades } from "@/actions/user/syncTrade";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PageIcons } from "@/lib/icons/page-icons";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { loadTradingAssetsWithPrices } from "@/lib/trading/assets";
import { redirect } from "next/navigation";
import TradingScreen from "./TradingScreen";

export default async function LiveTradingPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (settings && !settings.enableSelfTrade) {
    redirect("/dashboard");
  }

  try {
    const [assets, initial] = await Promise.all([
      loadTradingAssetsWithPrices(),
      syncTrades(session.userId),
    ]);

    const tradingData =
      initial && !("error" in initial)
        ? initial
        : { balance: 0, openTrades: [], history: [] };

    if (assets.length === 0) {
      return (
        <div className="space-y-6">
          <PageHeader
            icon={PageIcons.liveTrading}
            title="Live trading"
            description="Timed up/down positions on live market quotes."
          />
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            No tradeable assets are configured. Contact support or try again
            later.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PageHeader
          icon={PageIcons.liveTrading}
          title="Live trading"
          description="Professional terminal — chart, live quotes, and timed self-trade positions."
        />
        <TradingScreen
          assets={assets}
          initialBalance={tradingData.balance}
          initialOpenTrades={tradingData.openTrades}
          initialHistory={tradingData.history}
        />
      </div>
    );
  } catch (error) {
    console.error("Live trading page failed:", error);
    return (
      <div className="space-y-6">
        <PageHeader icon={PageIcons.liveTrading} title="Live trading" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40">
          <p className="font-medium text-red-700 dark:text-red-300">
            Unable to load live trading.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Refresh the page. If this continues, check your database connection.
          </p>
        </div>
      </div>
    );
  }
}
