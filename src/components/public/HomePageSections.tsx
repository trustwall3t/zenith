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
              {name} is a profitable and trusted investment program, established by a
              strong team of highly skilled traders and investment consultants in the
              offline and online investment market.
            </p>
            <p>
              We put your investments in new, highly remunerative innovative projects,
              which offer strong returns. Today our company has a professional team to
              develop the business.
            </p>
            <p>
              We know how much, where, and when to put your investments, and we know how
              to pursue income. We are constantly diversifying our investment portfolio
              and building stronger connections worldwide.
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
              <h3>Best consulting</h3>
              <p>
                You have ideas, goals, and dreams. Mutual funds pool money from many
                investors to purchase a broad range of investments, such as stocks.
              </p>
            </div>
          </article>
          <article className="gg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/main/images/features/feature2.jpg" alt="Market chart on a desk" />
            <div className="gg-card-body">
              <h3>Market growth</h3>
              <p>
                We are constantly diversifying the investment portfolio and building
                stronger connections worldwide.
              </p>
            </div>
          </article>
          <article className="gg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/main/images/features/feature3.jpg" alt="Clock beside planning notes" />
            <div className="gg-card-body">
              <h3>On time services</h3>
              <p>We know how much, where, and when to put your investments.</p>
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
            <h2>How to trade options in four steps</h2>
            <ul className="gg-list">
              <li>
                <strong>Investment objectives.</strong> This usually includes income,
                growth, capital preservation, or speculation.
              </li>
              <li>
                <strong>Trading experience.</strong> The broker will want to know your
                knowledge of investing, how long you have been trading stocks or
                options, how many trades you make per year, and the size of your trades.
              </li>
              <li>
                <strong>Personal financial information.</strong> Have on hand your liquid
                net worth, annual income, total net worth, and employment information.
              </li>
              <li>
                <strong>The types of options you want to trade.</strong> For instance,
                calls, puts, or spreads, and whether they are covered or naked.
              </li>
            </ul>
          </div>
          <div>
            <h2>Options trading</h2>
            <p>
              Options trading is when you buy or sell an underlying asset at a
              pre-negotiated price by a certain future date.
            </p>
            <p>
              Trading stock options can be complex — even more so than stock trading.
              Options trading requires an understanding of advanced strategies.
            </p>
            <p>
              “You can use options to speculate and to gamble, but the reality is ...
              the best use of options is to protect your downside,” experts say.
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
          Live quotes for indices, futures, bonds, and foreign exchange.
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
          <h2>Mirror your desired expert</h2>
          <p>
            {name} offers automated mirror trading services across sectors. Find your
            desired expert, get your account linked to their services, and mirror the
            trades.
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
              <img src="/main/images/services/mutualfunds1.jpg" alt="Mutual funds" />
              <div className="gg-card-body">
                <h3>Mutual funds</h3>
                <p>Mutual funds are steadily making an entry into household savings.</p>
                <p>
                  <Link href="/contact">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/services/commodity1.jpg" alt="Commodities" />
              <div className="gg-card-body">
                <h3>Commodities</h3>
                <p>Efficient exposure to commodity benchmarks since 2015.</p>
                <p>
                  <Link href="/advancetrading">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/services/realestate1.jpg" alt="Real estate" />
              <div className="gg-card-body">
                <h3>Real estate</h3>
                <p>Multifamily, office, industrial, retail, and hotel properties.</p>
                <p>
                  <Link href="/livetrading">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/services/oil1.jpg" alt="Oil and gas" />
              <div className="gg-card-body">
                <h3>Oil and gas</h3>
                <p>Stewardship, teamwork, and resiliency in energy production.</p>
                <p>
                  <Link href="/oilandgas">Read more</Link>
                </p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/main/images/services/infrastructure1.jpg"
                alt="Infrastructure"
              />
              <div className="gg-card-body">
                <h3>Infrastructure</h3>
                <p>Investments managed with passion, experience, and relationships.</p>
              </div>
            </article>
            <article className="gg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/main/images/tabs/img3.png" alt="Stock market display" />
              <div className="gg-card-body">
                <h3>Stocks and options</h3>
                <p>Copy trading and modern market data on {name}.</p>
                <p>
                  <Link href="/stocks">Read more</Link>
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
              ["Winning", "We are here to win — constantly improving and out-executing competitors."],
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
