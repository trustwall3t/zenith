/** Credibility strip at the bottom of service / inner pages. */
export function PublicServiceTrustBar({ brandName }: { brandName: string }) {
  return (
    <div className="gg-trust-bar" role="complementary" aria-label="Why members choose us">
      <div className="gg-trust-bar-item">
        <strong>Transparent plans</strong>
        <span>Published minimums, returns, and durations before you commit capital.</span>
      </div>
      <div className="gg-trust-bar-item">
        <strong>Member dashboard</strong>
        <span>
          Deposits, copy allocation, trading history, and support in one secure hub.
        </span>
      </div>
      <div className="gg-trust-bar-item">
        <strong>Dedicated support</strong>
        <span>
          {brandName} responds to account and verification questions within one business day.
        </span>
      </div>
    </div>
  );
}
