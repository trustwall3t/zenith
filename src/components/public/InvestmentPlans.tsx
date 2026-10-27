import { authSignupUrl } from "@/lib/public/auth-links";
import type { Plan, SiteInfo } from "@/types/site";

const MARKETING_PLAN_COUNT = 6;

function formatMoney(currency: string, amount: number) {
  return `${currency}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatPlanName(name: string) {
  return name.replace("Duluxe", "Deluxe");
}

function PlanCard({
  plan,
  site,
  featured,
}: {
  plan: Plan;
  site: SiteInfo;
  featured?: boolean;
}) {
  return (
    <>
      {featured ? <p className="gg-plan-label">Most sought after</p> : null}
      <h3 className="gg-plan-name">{formatPlanName(plan.name)}</h3>
      <p className="gg-plan-roi">
        <span>{plan.incrementAmount}%</span> {plan.incrementInterval}
      </p>
      <p className="gg-plan-range">
        {formatMoney(site.currency, plan.minPrice)} –{" "}
        {formatMoney(site.currency, plan.maxPrice)}
      </p>
      <a
        className={featured ? "gg-btn gg-btn-ghost" : "gg-btn gg-btn-solid"}
        href={authSignupUrl}
      >
        {featured ? "Get started" : "Choose plan"}
      </a>
    </>
  );
}

export function InvestmentPlans({
  plans,
  site,
}: {
  plans: Plan[];
  site: SiteInfo;
}) {
  if (!plans.length) return null;

  const visible = plans.slice(0, MARKETING_PLAN_COUNT);
  const featuredIndex = Math.floor((visible.length - 1) / 2);
  const featured = visible[featuredIndex];
  const companions = visible.filter((_, i) => i !== featuredIndex);

  return (
    <section
      className="gg-section gg-plans-section gg-plans-section--after-hero"
      id="plans"
    >
      <div className="gg-wrap">
        <header className="gg-plans-head">
          <p className="gg-plans-eyebrow">Investment tiers</p>
          <h2 className="gg-plans-title">Choose a plan aligned with your goals</h2>
          <p className="gg-plans-lead">
            Transparent minimums, published returns, and flexible durations. Register
            to activate any tier.
          </p>
        </header>
        <div className="gg-plans-bento">
          {featured ? (
            <article className="gg-plan-tier gg-plan-tier--featured">
              <PlanCard plan={featured} site={site} featured />
            </article>
          ) : null}
          {companions.length ? (
            <div className="gg-plans-rail" role="list">
              {companions.map((plan) => (
                <article key={plan.id} className="gg-plan-tier">
                  <PlanCard plan={plan} site={site} />
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
