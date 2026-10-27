import { authLoginUrl, authSignupUrl } from "@/lib/public/auth-links";
const slides = [
  "/main/img/carousel/finance-district-skyline.jpg",
  "/main/img/carousel/trading-desk-analytics.jpg",
  "/main/img/carousel/team-collaboration-office.jpg",
  "/main/img/carousel/data-dashboard-charts.jpg",
  "/main/img/carousel/professional-handshake.jpg",
  "/main/img/carousel/modern-corporate-workspace.jpg",
];

export function HeroSection({ welcomeMessage }: { welcomeMessage: string }) {
  return (
    <section className="gg-hero" data-hero-interval="5500">
      <div className="gg-hero-bg" aria-hidden="true">
        {slides.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            className={`gg-hero-bg-slide${i === 0 ? " is-active" : ""}`}
            src={src}
            alt=""
            width={1400}
            height={788}
            decoding={i === 0 ? "async" : undefined}
            loading={i === 0 ? undefined : "lazy"}
            fetchPriority={i === 0 ? "high" : undefined}
          />
        ))}
      </div>
      <div className="gg-hero-copy">
        <p className="gg-kicker">{welcomeMessage}</p>
        <h1>Your future is created by</h1>
        <h2>What you do today</h2>
        <p>
          Trade live forex, cryptocurrencies, stocks, and commodities on one platform.
          Session coverage includes Tokyo, Hong Kong, Singapore, and other Asian markets.
          Copy trading is available when you want to follow published strategies.
        </p>
        <div className="gg-actions">
          <a className="gg-btn" href={authLoginUrl}>
            Sign in
          </a>
          <a className="gg-btn-ghost" href={authSignupUrl}>
            Sign up
          </a>
        </div>
      </div>
    </section>
  );
}
