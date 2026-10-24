import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PageIcons } from "@/lib/icons/page-icons";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { JoinPlanForm } from "./JoinPlanForm";
import { ActivePlansSection } from "./ActivePlansSection";
import {
  getUserInvestmentPlanViews,
  getUserRoiHistory,
} from "@/lib/investment/user-plans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function InvestmentPlansPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (settings && !settings.enableInvestmentPlans) {
    redirect("/dashboard");
  }

  const [plans, userPlans, roiHistory, user] = await Promise.all([
    db.investmentPlan.findMany({ orderBy: { minPrice: "asc" } }),
    getUserInvestmentPlanViews(session.userId),
    getUserRoiHistory(session.userId, 15),
    db.user.findUnique({
      where: { id: session.userId },
      select: { roiTotal: true },
    }),
  ]);

  const currency = settings?.currency ?? "$";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.plans}
        title="Investment plans"
        description="View active plans, ROI performance, and join new tiers."
      />

      <Tabs defaultValue="my-plans" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="my-plans">My plans & ROI</TabsTrigger>
          <TabsTrigger value="browse">Browse plans</TabsTrigger>
        </TabsList>

        <TabsContent value="my-plans" className="mt-6">
          <ActivePlansSection
            plans={userPlans}
            roiHistory={roiHistory}
            currency={currency}
            roiTotal={user?.roiTotal ?? 0}
          />
        </TabsContent>

        <TabsContent value="browse" className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Join with funds from your wallet. ROI is applied automatically on
            each plan’s schedule when trading is enabled globally and on your
            account.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <DashboardPanel key={plan.id}>
                <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    {plan.name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {plan.planType}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-2xl font-semibold">
                    {plan.incrementAmount}%
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {plan.incrementInterval}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Min {currency}
                    {plan.minPrice.toLocaleString()} · Max {currency}
                    {plan.maxPrice.toLocaleString()}
                  </p>
                  {plan.expiration ? (
                    <p className="text-xs text-muted-foreground">
                      Term: {plan.expiration}
                    </p>
                  ) : null}
                  <JoinPlanForm
                    planId={plan.id}
                    minPrice={plan.minPrice}
                    maxPrice={plan.maxPrice}
                    currency={currency}
                  />
                </div>
              </DashboardPanel>
            ))}
            {plans.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No plans in database. Run{" "}
                <code className="text-xs">npm run db:seed-zenith</code>.
              </p>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
