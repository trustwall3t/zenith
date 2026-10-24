import { authSignupUrl } from "@/lib/public/auth-links";
import type { Plan, SiteInfo } from "@/types/site";

function formatMoney(currency: string, amount: number) {
  return `${currency}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function InvestmentPlans({
  plans,
  site,
}: {
  plans: Plan[];
  site: SiteInfo;
}) {
  if (!plans.length) return null;

  const featuredIndex = Math.floor(Math.max(0, plans.length - 1) / 2);
  const featured = plans[featuredIndex];
  const companions = plans.filter((_, i) => i !== featuredIndex);

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
            Transparent minimums, published returns, and flexible durations — register
            to activate any tier.
          </p>
        </header>
        <div className="gg-plans-bento">
          {featured ? (
            <article className="gg-plan-tier gg-plan-tier--featured">
              <p className="gg-plan-label">Featured tier</p>
              <h3 className="gg-plan-name">
                {featured.name.replace("Duluxe", "Deluxe")}
              </h3>
              <p className="gg-plan-roi">
                <span>{featured.incrementAmount}%</span> {featured.incrementInterval}
              </p>
              <dl className="gg-plan-meta">
                <div>
                  <dt>Minimum</dt>
                  <dd>{formatMoney(site.currency, featured.minPrice)}</dd>
                </div>
                <div>
                  <dt>Maximum</dt>
                  <dd>{formatMoney(site.currency, featured.maxPrice)}</dd>
                </div>
              </dl>
              <a className="gg-btn gg-btn-ghost" href={authSignupUrl}>
                Get started
              </a>
            </article>
          ) : null}
          {companions.length ? (
            <div className="gg-plans-rail" role="list">
              {companions.map((plan) => (
                <article key={plan.id} className="gg-plan-tier">
                  <h3 className="gg-plan-name">{plan.name}</h3>
                  <p className="gg-plan-roi">
                    <span>{plan.incrementAmount}%</span> {plan.incrementInterval}
                  </p>
                  <p className="gg-plan-range">
                    {formatMoney(site.currency, plan.minPrice)} –{" "}
                    {formatMoney(site.currency, plan.maxPrice)}
                  </p>
                  <a className="gg-btn gg-btn-solid" href={authSignupUrl}>
                    Choose plan
                  </a>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
