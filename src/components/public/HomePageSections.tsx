import { TradingViewMarketQuotes } from "@/components/public/TradingViewMarketQuotes";
import { authSignupUrl } from "@/lib/public/auth-links";
import type { HomeStats, SiteInfo } from "@/types/site";
import Link from "next/link";

type Props = { site: SiteInfo; stats: HomeStats | null };

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export function HomePageIntroSections({ site }: { site: SiteInfo }) {
  const name = site.siteName;

  return (
    <>
      <section className="gg-section">
        <div className="gg-wrap gg-split">
          <div>
            <p className="gg-kicker">About us</p>
            <h2>Different kinds of financial services</h2>
            <p>
              {name} combines live trading, forex, digital assets, equities, and
              commodities in one member platform. The stack is built for traders who
              follow global sessions, with attention to liquidity and news flow across
              Asian markets.
            </p>
            <p>
              Self-directed live trading, structured investment plans, and optional copy
              trading sit alongside real-time quotes, scanners, and signals in your
              dashboard so you can act on opportunities in Tokyo, Hong Kong, Singapore,
              and London and New York hours from a single account.
            </p>
            <p>
              Our team focuses on execution quality, transparent reporting, and risk
              tools across product lines so you can diversify by asset class and stay
              aligned with your goals.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/intro-video.jpg"
            alt="People reviewing investment plans together"
          />
        </div>
      </section>

      <section className="gg-section" style={{ paddingTop: 0 }}>
        <div className="gg-wrap gg-cards">
          <article className="gg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/main/images/features/feature1.jpg" alt="Advisor meeting with a client" />
            <div className="gg-card-body">
              <h3>Live trading</h3>
              <p>
                Open timed positions on live quotes for major forex pairs, crypto, indices,
                and metals, with charts and wallet integration in the member area.
              </p>
            </div>
          </article>
          <article className="gg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/main/images/features/feature2.jpg" alt="Market chart on a desk" />
            <div className="gg-card-body">
              <h3>Forex &amp; crypto</h3>
              <p>
                Trade major, minor, and Asian cross pairs alongside leading
                cryptocurrencies, with spreads and session tools for 24-hour markets.
              </p>
            </div>
          </article>
          <article className="gg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/main/images/features/feature3.jpg" alt="Clock beside planning notes" />
            <div className="gg-card-body">
              <h3>Stocks &amp; commodities</h3>
              <p>
                Equities, energy, metals, and agricultural benchmarks, plus futures
                widgets for Nikkei, Hang Seng, and regional benchmarks.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="gg-section gg-deep">
        <div className="gg-wrap gg-split">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="gg-figure"
              src="/main/images/forex_trade.jpg"
              alt="Trader looking at currency charts"
            />
            <h2>Built for global sessions, with focus on Asia</h2>
            <ul className="gg-list">
              <li>
                <strong>Asian cash &amp; FX.</strong> Follow JPY, AUD, NZD, CNH-related
                pairs and regional indices when Tokyo, Hong Kong, and Singapore are
                active.
              </li>
              <li>
                <strong>Live trading.</strong> Act on streaming prices for forex, crypto,
                and benchmark contracts without leaving the dashboard.
              </li>
              <li>
                <strong>Stocks &amp; commodities.</strong> Combine equity themes with
                gold, oil, and industrial metals for diversified exposure.
              </li>
              <li>
                <strong>Copy trading (optional).</strong> Mirror selected leaders when
                you prefer a guided allocation alongside self-directed trades.
              </li>
            </ul>
          </div>
          <div>
            <h2>One platform, multiple asset classes</h2>
            <p>
              {name} is not a copy-trading-only broker. Members use live trading for
              short-horizon positions, forex and crypto for round-the-clock liquidity,
              and stocks and commodities for longer themes. Everything reports to one
              wallet and transaction history.
            </p>
            <p>
              Market tickers and TradingView widgets on this site surface indices, FX,
              bonds, and futures so you can monitor Nikkei, Hang Seng, S&amp;P 500, and
              major FX crosses before you sign in.
            </p>
            <p>
              <Link href="/livetrading">Explore live trading</Link>,{" "}
              <Link href="/forex">forex &amp; crypto</Link>, and{" "}
              <Link href="/stocks">stocks</Link> to see how each fits your plan.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function HomePageMarketsSection() {
  return (
    <section className="gg-section gg-quotes">
      <div className="gg-wrap">
        <h2>Markets</h2>
        <p className="gg-lead">
          Live quotes for indices (including Nikkei and Hang Seng), futures, bonds, forex,
          and crypto, updated for active Asian and global sessions.
        </p>
        <TradingViewMarketQuotes />
      </div>
    </section>
  );
}

export function HomePageRestSections({ site, stats }: Props) {
  const name = site.siteName;
  const cur = site.currency;

  return (
    <>
      <section className="gg-section" style={{ paddingTop: 0 }}>
        <div className="gg-wrap gg-split">
          <div>
            <h2>Investor relations</h2>
            <p>
              {name} provides advanced investment strategies and wealth management
              solutions to forward-thinking investors around the world.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/service-single1.jpg"
            alt="Portfolio review on a conference table"
          />
        </div>
        <div className="gg-wrap" style={{ marginTop: "2.5rem" }}>
          <h2>Live trading &amp; optional copy strategies</h2>
          <p>
            Use live trading for your own entries on streaming quotes, or subscribe to
            copy traders when you want mirrored signals. Forex, crypto, equities, and
            commodities share the same member workflow, history, and balances.
          </p>
        </div>
      </section>

      <section className="gg-section gg-soft" id="services">
        <div className="gg-wrap">
          <p className="gg-kicker">Our services</p>
          <h2>What we do</h2>
          <div className="gg-cards" style={{ marginTop: "1.4rem" }}>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/services/forex1.jpg" alt="Live trading terminal" />
              <div className="gg-card-body">
                <h3>Live trading</h3>
                <p>Timed positions on live forex, crypto, and benchmark quotes.</p>
                <p>
                  <Link href="/livetrading">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/forex_trade.jpg" alt="Forex and crypto" />
              <div className="gg-card-body">
                <h3>Forex &amp; crypto</h3>
                <p>Major and Asian cross pairs plus leading digital assets.</p>
                <p>
                  <Link href="/forex">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/services/stock1.jpg" alt="Stock trading" />
              <div className="gg-card-body">
                <h3>Stocks &amp; equities</h3>
                <p>Education, tools, and trading themes for global equities.</p>
                <p>
                  <Link href="/stocks">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/services/commodity1.jpg" alt="Commodities" />
              <div className="gg-card-body">
                <h3>Commodities</h3>
                <p>Metals, energy, and agricultural benchmarks since 2015.</p>
                <p>
                  <Link href="/advancetrading">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/services/mutualfunds1.jpg" alt="Mutual funds" />
              <div className="gg-card-body">
                <h3>Mutual funds</h3>
                <p>Diversified fund strategies alongside your trading wallet.</p>
                <p>
                  <Link href="/contact">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/tabs/img3.png" alt="Copy trading" />
              <div className="gg-card-body">
                <h3>Copy trading</h3>
                <p>Optional mirrored strategies when you want to follow experienced leaders.</p>
                <p>
                  <Link href="/optioncopytrading">Read more</Link>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="gg-section">
        <div className="gg-wrap">
          <h2>Our partners</h2>
          <ul className="gg-partners">
            {[
              ["bbc.svg", "BBC"],
              ["bloomberg.svg", "Bloomberg"],
              ["cnbc.svg", "CNBC"],
              ["ft.svg", "Financial Times"],
              ["marketwatch.svg", "MarketWatch"],
              ["nytimes.svg", "The New York Times"],
              ["reuters.svg", "Reuters"],
              ["wsj.svg", "The Wall Street Journal"],
            ].map(([file, alt]) => (
              <li key={file}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/main/images/partners/${file}`} alt={alt} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {stats ? (
        <section className="gg-section" style={{ paddingTop: 0 }}>
          <div className="gg-wrap gg-stats">
            <div className="gg-stat">
              <strong>{fmt(stats.totalUsers)}</strong>
              <span>Accounts</span>
            </div>
            <div className="gg-stat">
              <strong>
                {cur}
                {fmt(stats.totalDeposits)}
              </strong>
              <span>Processed deposits</span>
            </div>
            <div className="gg-stat">
              <strong>
                {cur}
                {fmt(stats.totalWithdrawals)}
              </strong>
              <span>Processed withdrawals</span>
            </div>
          </div>
        </section>
      ) : null}

      <section className="gg-section" style={{ paddingTop: 0 }}>
        <div className="gg-wrap">
          <h2>Our asset management solutions</h2>
          <p>
            Time is a precious commodity. {name}&apos;s asset management solutions let you
            delegate the daily management of your assets to experienced professionals.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/infrastructure1.jpg"
            alt="Large infrastructure development"
            style={{ margin: "1.2rem 0" }}
          />
          <h3>Different goals require different approaches</h3>
          <p>
            At {name} we recognize that each investor is unique. We take a personalized
            approach to developing an asset management strategy.
          </p>
          <div className="gg-split" style={{ marginTop: "1.4rem", alignItems: "start" }}>
            <div>
              <h3>To provide you additional value, we strive to:</h3>
              <ul className="gg-list">
                <li>Create opportunities for rewards while managing risk.</li>
                <li>Minimize management and administrative costs.</li>
                <li>Provide ongoing services that adapt to changes in your goals.</li>
              </ul>
            </div>
            <div>
              <h3>Active-core strategy</h3>
              <p>
                A solid wealth plan ensures you have a financial strategy that supports
                your aspirations through retirement and beyond.
              </p>
              <h3>Active asset management</h3>
              <p>
                Value is driven from active management, stakeholder engagement, and
                selecting appropriate internal management teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="gg-section gg-soft">
        <div className="gg-wrap">
          <h2>Our values</h2>
          <p className="gg-lead">
            At the heart of our business are our partners: the entrepreneurs and
            management teams we back; the investors in our funds; and the advisers we
            work with.
          </p>
          <div className="gg-cards gg-cards--values-four">
            {[
              ["Highly ambitious", "We strive to build world-class businesses to generate superior returns."],
              ["Winning", "We aim to improve execution and service continuously."],
              ["Integrity", "We do things the right way, without compromise, the first time, every time."],
              ["Learning", "We are driven by a thirst for knowledge and pursue new ideas and strategies."],
            ].map(([h, p]) => (
              <article className="gg-card" key={h}>
                <div className="gg-card-body">
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gg-section" style={{ paddingTop: 0 }}>
        <div className="gg-wrap gg-cards">
          <article className="gg-card">
            <div className="gg-card-body">
              <p>
                From complex wealth management to your retirement needs, we can help you
                with financial planning.{" "}
                <a href={authSignupUrl}>Get started</a>
              </p>
            </div>
          </article>
          <article className="gg-card">
            <div className="gg-card-body">
              <p>
                We are a leading investment solutions partner, dedicated to improving
                people&apos;s financial security.
              </p>
            </div>
          </article>
          <article className="gg-card">
            <div className="gg-card-body">
              <p>
                We help investors contribute to a better world and offer them attractive
                returns.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
