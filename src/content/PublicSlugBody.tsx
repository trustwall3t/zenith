import { ForexCurrencyPairs } from "@/components/public/ForexCurrencyPairs";
import { PublicProseCta } from "@/components/public/PublicProseCta";
import { PublicServiceLayout } from "@/components/public/PublicServiceLayout";
import { PublicServicesSidebar } from "@/components/public/PublicServicesSidebar";
import { STATISTIC_NEWS } from "@/content/statistic-news";
import type { PublicSlug } from "@/content/public-slugs";
import {
  authForgotPasswordUrl,
  authLoginUrl,
  authSignupUrl,
} from "@/lib/public/auth-links";
import type { SiteInfo } from "@/types/site";
import Link from "next/link";

type Props = { slug: PublicSlug; site: SiteInfo };

export function PublicSlugBody({ slug, site }: Props) {
  const name = site.siteName;
  const email = site.contactEmail ?? "support@example.com";

  switch (slug) {
    case "about":
      return (
        <div className="gg-wrap gg-split">
          <div className="gg-prose">
            <p>
              {name} is one of the world&apos;s leading asset management firms, with
              approximately $2.2 trillion in assets under management. The firm was
              founded in 2015. We create lasting impact for our investors, teams,
              businesses, and the communities in which we live.
            </p>
            <p>
              We pioneered a consulting-based approach to private asset investing,
              partnering closely with management teams to offer insights that challenge
              conventional thinking, build businesses, and improve operations.
            </p>
            <p>
              Today {name} serves traders and investors who want live forex and crypto
              execution, equities and commodity exposure, and structured plans, with
              workflows tuned for Asian session open through overlap with London and New
              York. Copy trading remains available for those who prefer mirrored
              strategies, but it is one channel among many.
            </p>
            <p>
              The shared values of our culture include integrity, collegiality,
              learning, humility, respect for diversity of thought, and a focus on our
              clients.
            </p>
            <PublicProseCta
              label="Work with our team"
              hint="Members access live trading, forex, crypto, stocks, commodities, plans, and reporting in one dashboard."
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/pages/about_2.png"
            alt="Illustration of a team working together"
          />
        </div>
      );

    case "contact":
      return (
        <div className="gg-wrap gg-contact">
          <aside className="gg-panel gg-pad">
            <h2>Get in touch</h2>
            <p>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
            <p>
              <Link href="/">{name}</Link>
            </p>
            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--gg-muted)" }}>
              Member support is available for account, deposit, and verification
              questions. We respond to most inquiries within one business day.
            </p>
          </aside>
          <div className="gg-layout">
            <article className="gg-prose">
              <h2>Mutual funds</h2>
              <p>
                Mutual funds are steadily making an entry into household savings, with
                increased awareness about financial planning and higher efforts towards
                promoting mutual funds as an investment product. A wide range of schemes
                makes it easier to choose a fund that suits your financial goals.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="gg-figure"
                src="/main/images/services/mutualfunds1.jpg"
                alt="Mutual fund planning documents"
              />
              <p>
                {name} offers a broad range of investment strategies to fit within your
                asset allocation, including quantitative factor strategies designed to
                capture excess returns and manage risk.
              </p>
              <h3>Why invest with {name} asset management funds?</h3>
              <p>
                We believe investors should be compensated for the risks they take in
                all market environments. We combine capital markets research, portfolio
                construction, and risk management to craft solutions that deliver
                targeted outcomes.
              </p>
              <PublicProseCta />
            </article>
            <PublicServicesSidebar />
          </div>
        </div>
      );

    case "faq":
      return (
        <div className="gg-wrap gg-faq">
          <details open>
            <summary>What can I trade on {name}?</summary>
            <p>
              Members can use live trading on streaming quotes, access forex and
              cryptocurrencies, follow stock and commodity education pages, enroll in
              investment plans, and optionally subscribe to copy traders, all from one
              dashboard.
            </p>
          </details>
          <details>
            <summary>Do you support Asian market hours?</summary>
            <p>
              Yes. Quotes and widgets highlight regional indices such as Nikkei and Hang
              Seng, and forex content calls out JPY, AUD, NZD, and Asian cross pairs
              during Tokyo, Hong Kong, and Singapore sessions.
            </p>
          </details>
          <details>
            <summary>How can I invest with {name}?</summary>
            <p>
              To make an investment you must first become a member. Once you are signed
              up, you can make your first deposit through the members area.
            </p>
          </details>
          <details>
            <summary>
              I want to invest but I do not have an e-currency account. What should I do?
            </summary>
            <p>
              You can open a Perfect Money account at{" "}
              <a href="https://www.perfectmoney.is/" rel="noopener noreferrer">
                perfectmoney.is
              </a>
              . Other funding methods appear in the deposit section after you{" "}
              <a href={authSignupUrl}>register</a>.
            </p>
          </details>
          <details>
            <summary>How do I open my {name} account?</summary>
            <p>
              Follow the <a href={authSignupUrl}>registration</a> link, fill in
              the form, and press Register.
            </p>
          </details>
          <details>
            <summary>Which e-currencies do you accept?</summary>
            <p>We accept e-currencies. The methods available are shown when you make a deposit.</p>
          </details>
          <details>
            <summary>How can I withdraw funds?</summary>
            <p>Log in with your username and password and open the Withdraw section.</p>
          </details>
          <details>
            <summary>How long does it take for my deposit to be added to my account?</summary>
            <p>Your account is updated as soon as your deposit is processed.</p>
          </details>
          <details>
            <summary>How can I change my email address or password?</summary>
            <p>
              Log into your account and open Account Information. You can also use the{" "}
              <a href={authForgotPasswordUrl}>forgot password</a> page.
            </p>
          </details>
          <details>
            <summary>Is a daily profit paid directly to my currency account?</summary>
            <p>
              No. Profits are gathered on your {name} account and you can withdraw them
              from there.
            </p>
          </details>
          <details>
            <summary>How do you calculate the interest on my account?</summary>
            <p>
              It depends on each plan. Interest can be acquired daily, weekly,
              bi-weekly, monthly, or yearly and is credited to your available balance.
            </p>
          </details>
          <details>
            <summary>Can I deposit directly from my account balance?</summary>
            <p>Yes. Log in, open Make Deposit, and select the deposit from account balance option.</p>
          </details>
          <details>
            <summary>Can I make an additional deposit once the account is open?</summary>
            <p>Yes. Each transaction is handled separately.</p>
          </details>
          <details>
            <summary>After I request a withdrawal, when are the funds available?</summary>
            <p>Funds are usually available within 12 business hours.</p>
          </details>
          <details>
            <summary>Can I lose money?</summary>
            <p>
              There is risk in every investment program. Align your investments with
              your financial goals, and only commit money you can afford to risk.
            </p>
          </details>
          <details>
            <summary>How can I check my account balance?</summary>
            <p>You can access account information over the internet, 24 hours a day.</p>
          </details>
          <details>
            <summary>May I open several accounts?</summary>
            <p>No. If one member is found to have more than one account, the funds may be frozen.</p>
          </details>
          <details>
            <summary>Who manages the funds?</summary>
            <p>These funds are managed by a team of {name} investment specialists.</p>
          </details>
        </div>
      );

    case "forex":
      return (
        <PublicServiceLayout brandName={name}>
          <p>
            The forex market (FX) is the world&apos;s largest decentralised financial
            market, with trading volumes exceeding $6.6 trillion a day. Trading 24 hours
            a day, there is always an opportunity to buy or sell.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/forex1.jpg"
            alt="Currency symbols on a trading screen"
          />
          <h2>Asian session &amp; cross pairs</h2>
          <p>
            When Tokyo, Hong Kong, and Singapore lead volatility, JPY, AUD, NZD, and
            regional crosses often drive liquidity. We highlight these sessions alongside
            London and New York so you can plan entries around local economic releases
            and equity opens.
          </p>
          <h2>Forex spreads and currency pairs</h2>
          <p>
            Spreads are fed from liquidity providers, with no dealing desk in between.
            More than 60 currency pairs are offered for experienced and new traders
            alike.
          </p>
          <h2>Currency pairs</h2>
          <ForexCurrencyPairs />
          <h2 id="cryptocurrencies">Cryptocurrencies</h2>
          <p>
            Trade leading digital assets from the same member hub as forex, with live
            quotes for short-horizon live trading and longer-term allocation.
            Crypto markets run 24/7; combine them with Asian FX hours or use them when
            traditional equity sessions are closed.
          </p>
          <ul>
            <li>Transparent pricing with competitive spreads on major pairs.</li>
            <li>Leverage up to 1:100 for professional traders where permitted.</li>
            <li>Stocks, indices, and commodities available alongside FX and crypto.</li>
            <li>Live trading and optional copy strategies from one wallet.</li>
          </ul>
          <PublicProseCta
            label={`Trade with ${name}`}
            hint="Sign up for live quotes, live trading, and multi-asset reporting."
          />
        </PublicServiceLayout>
      );

    case "stocks":
      return (
        <PublicServiceLayout brandName={name}>
          <h2>How stock trading works</h2>
          <p>
            Stock trading is a form of investing that prioritizes short-term profits over
            long-term gains. It can be risky to dive in without the proper knowledge.
            {name} provides education, live quotes, and live trading tools so you can
            participate in global and Asian-linked equities with defined risk. Optional
            copy trading is available if you prefer mirrored entries.
          </p>
          <h3>What is stock trading?</h3>
          <p>
            Stock trading involves buying and selling shares in companies in an effort to
            make money on daily changes in price. Traders watch short-term price
            fluctuations closely and then try to buy low and sell high.
          </p>
          <p>
            This short-term approach is what sets stock traders apart from traditional
            buy-and-hold investors. While trading individual stocks can bring quick gains
            for those who time the market correctly, it also carries the danger of
            substantial losses. Diversification and position sizing matter.
          </p>
          <h3>Types of stock trading</h3>
          <p>
            <strong>Active trading</strong> is what an investor who places 10 or more
            trades per month does. Typically, they use a strategy that relies on timing
            the market, trying to take advantage of short-term events.
          </p>
          <p>
            <strong>Day trading</strong> is the strategy used by investors who buy, sell,
            and close their positions in the same stock in a single trading day, aiming to
            profit from intraday price fluctuations.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/stock1.jpg"
            alt="Stock trading desk with market screens"
          />
          <h3>Where to trade stocks</h3>
          <p>
            To trade stocks you need a broker. {name} aligns tools with your experience:
            screening, alerts, commodity and index context, and the same wallet used for
            forex, crypto, and live trading, so regional equity themes can sit next to
            your FX and metals exposure.
          </p>
          <p>
            The time spent learning how to research stocks is time well spent, as long
            as you are not putting money you cannot afford to lose on the line.
          </p>
          <PublicProseCta />
        </PublicServiceLayout>
      );

    case "futures":
      return (
        <PublicServiceLayout brandName={name}>
          <p>
            Futures contracts let you participate in price movements across equity
            indices, currencies, metals, energy, and agricultural markets, with defined
            margin, expiry, and transparent exchange rules.
          </p>
          <h2>Why futures matter in a diversified plan</h2>
          <p>
            Futures are used by institutions and professional traders for hedging and
            speculation. For qualified members, exposure to benchmark contracts can
            complement stocks, forex, and structured investment plans inside a single
            {name} account framework.
          </p>
          <h3>Contracts highlighted on our platform</h3>
          <p>Our public quote board and market widgets include:</p>
          <ul>
            <li>
              Equity index: Nikkei, Hang Seng, S&amp;P 500, US 100, Dow Jones, DAX, FTSE
            </li>
            <li>Energy: WTI crude oil, natural gas</li>
            <li>Metals: gold and industrial metals</li>
            <li>Agriculture: corn and related soft commodities</li>
            <li>Currencies: euro and major FX futures</li>
          </ul>
          <p>
            Explore related markets on our{" "}
            <Link href="/stocks">stocks</Link>, <Link href="/forex">forex</Link>,{" "}
            <Link href="/advancetrading">commodities</Link>, and{" "}
            <Link href="/oilandgas">oil and gas</Link> pages.
          </p>
          <PublicProseCta label="Access member markets" />
        </PublicServiceLayout>
      );

    case "advancetrading":
      return (
        <PublicServiceLayout brandName={name}>
          <p>
            With a long-term track record at {name} since 2015, our portfolio management
            team has been providing efficient and cost-effective exposure to a variety of
            commodity benchmarks. The team seeks to add value by identifying market
            inefficiencies and price dislocations while preserving diversification and
            inflation-awareness in the asset class.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/commodity1.jpg"
            alt="Stored commodity materials"
          />
          <p>
            Examples include gold, copper, silver, and platinum. As demand grows for
            battery metals and industrial inputs, commodity markets remain a core pillar
            of institutional asset allocation.
          </p>
          <h3>How we approach commodities</h3>
          <ul>
            <li>Enhanced index and active management mandates</li>
            <li>Conservative cash-collateral management alongside futures exposure</li>
            <li>Reporting aligned with member dashboard transparency</li>
          </ul>
          <PublicProseCta />
        </PublicServiceLayout>
      );

    case "oilandgas":
      return (
        <PublicServiceLayout brandName={name}>
          <p>
            {name} strives to be the community partner of choice as we develop oil and
            natural gas in a sustainable, innovative way. We focus on low-risk
            development opportunities in oil and liquids-rich zones. Combined with
            rigorous standards, we believe stewardship, teamwork, excellence, and
            resiliency represent a high standard of energy production.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/oil1.jpg"
            alt="Oil and gas facility"
          />
          <p>
            Our success is founded in relationships, deep local knowledge, and strength
            in technical and financial capabilities. We seek lower-risk, multi-faceted
            value creation through operational efficiency and enhanced recovery potential.
          </p>
          <h3>Member participation</h3>
          <p>
            Structured plans and market education allow members to align a portion of
            their portfolio with energy themes while maintaining clear minimums,
            durations, and published return intervals on{" "}
            <Link href="/#plans">investment tiers</Link>.
          </p>
          <PublicProseCta />
        </PublicServiceLayout>
      );

    case "livetrading":
      return (
        <PublicServiceLayout brandName={name}>
          <p>
            Live trading on {name} lets you open timed up/down positions on streaming
            market quotes for forex majors, cryptocurrencies, indices, and metals, without
            switching platforms. Prices refresh for active sessions, including Asian
            hours when Tokyo and regional benchmarks set the tone for the day.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/forex1.jpg"
            alt="Live trading charts"
          />
          <h2>How it fits your account</h2>
          <p>
            Live trades draw from your member wallet alongside investment plans, deposits,
            and withdrawals. History, open positions, and balances stay in one dashboard
            next to trade signals and scanners when those features are enabled for your
            account.
          </p>
          <h3>What you can trade live</h3>
          <ul>
            <li>Forex pairs, including crosses active during Asian sessions</li>
            <li>Major cryptocurrencies</li>
            <li>Benchmark indices and metals quoted on the platform</li>
            <li>Complements longer-term stock and commodity themes on other pages</li>
          </ul>
          <p>
            Prefer guidance instead of self-directed entries? See{" "}
            <Link href="/optioncopytrading">copy trading</Link> or explore{" "}
            <Link href="/forex">forex &amp; crypto</Link> and{" "}
            <Link href="/stocks">stocks</Link> for context.
          </p>
          <PublicProseCta label="Open live trading" hint="Register to access the member live trading screen." />
        </PublicServiceLayout>
      );

    case "softwares":
      return (
        <PublicServiceLayout brandName={name}>
          <p>
            The things you see yourself doing when the workday no longer belongs to
            someone else. The places you picture yourself exploring. The people you
            intend to spend it all with. If you can imagine the way you want to retire,
            you can plan for it.
          </p>
          <p>
            With employer pensions on the decline and uncertainty surrounding Social
            Security, retirement planning is more important than ever. At {name}, we can
            help you understand how much you will need to retire the way you want, and
            develop an income strategy to get you there. We look at your expenses,
            priorities, and goals and help you put your money to work.
          </p>
          <PublicProseCta label="Start planning" />
          <h3>Where can retirement income come from?</h3>
          <p>Beyond traditional investments, retirement income may include:</p>
          <ul>
            <li>Annuities: put money away now for income later</li>
            <li>Whole life policies with living benefits after you stop working</li>
            <li>IRAs and employer 401(k) plans combined with platform investment plans</li>
            <li>Dividends and plan ROI credited to your {name} wallet</li>
          </ul>
          <h3>When should I start saving for retirement?</h3>
          <p>
            The earlier you start planning, the longer you have to build savings. Even if
            you plan to retire in the next year or two, there is time to get prepared.
            Thanks to compounding, starting earlier often matters more than saving for
            more years but starting late.
          </p>
          <h3>Platform tools</h3>
          <p>
            Members use the dashboard for balances, active plans, copy-trading
            allocation, transaction history, and withdrawal requests in one secure place
            to monitor retirement and growth strategies together.
          </p>
        </PublicServiceLayout>
      );

    case "optioncopytrading":
      return (
        <PublicServiceLayout brandName={name}>
          <h2>What are options?</h2>
          <p>
            Options are tradable contracts that investors use to speculate about whether
            an asset&apos;s price will be higher or lower at a certain date in the
            future, without any requirement to actually buy the asset in question.
          </p>
          <p>
            Copy trading on {name} is optional. You can mirror experienced traders who
            publish defined-risk strategies while you control allocation size from your
            dashboard, alongside live forex, crypto, and equity tools if you trade
            directly.
          </p>
          <h3>Key terms</h3>
          <p>
            <strong>Derivative.</strong> Options derive their value from another asset.
            For example, stock options move with the underlying share price.
          </p>
          <p>
            <strong>Call and put.</strong> A call gives the opportunity to buy at a
            strike price by expiration; a put gives the opportunity to sell. The premium
            is the price you pay for the contract.
          </p>
          <p>
            <strong>In the money / out of the money.</strong> Depends on the underlying
            price versus strike and time remaining until expiration.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/forex_trade.jpg"
            alt="Trader reviewing market prices"
          />
          <h2>How options pricing works</h2>
          <p>
            You pay a premium up front, which gives you the right (not the obligation) to
            buy or sell at the strike price by the expiration date. Lower strike calls
            and higher strike puts carry different intrinsic value profiles. Your copy
            leaders document how they approach these setups.
          </p>
          <h2>Copy trading with {name}</h2>
          <p>
            Subscribe to active traders, set allocation percentage, and receive mirrored
            signals in your history. You can pause or stop copying at any time from{" "}
            <a href={authLoginUrl}>your dashboard</a>.
          </p>
          <PublicProseCta label="Subscribe to copy traders" />
        </PublicServiceLayout>
      );

    case "investments":
      return (
        <PublicServiceLayout brandName={name}>
          <p>
            Our team of agricultural specialists understands that different types of
            farming often have different needs. Our knowledge of the sector can help you
            with the daily challenge of improving efficiency to maximise potential
            growth.
          </p>
          <p>
            As well as machinery and technology, investment in biomass to create reusable
            energy can reduce financial costs and, in some instances, provide a source
            of additional income.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-figure"
            src="/main/images/services/agriculture1.jpg"
            alt="Agricultural field and equipment"
          />
          <p>
            Whether you need new equipment to improve productivity or are looking to
            restructure finances to improve cash flow, structured products can be tailored
            to meet your needs within manageable timescales.
          </p>
          <h3>Types of assets we can finance</h3>
          <ul>
            <li>Balers, combine harvesters, tractors, and farm vehicles</li>
            <li>Biomass boilers and ground maintenance equipment</li>
            <li>Forestry machinery and ploughs</li>
          </ul>
          <h3>Investment plans on the platform</h3>
          <p>
            Published investment tiers with minimums, return intervals, and durations are
            listed on the <Link href="/#plans">homepage</Link>. Join after{" "}
            <a href={authSignupUrl}>registration</a> and fund your wallet to
            activate a tier.
          </p>
          <PublicProseCta label="View plans & register" />
        </PublicServiceLayout>
      );

    case "statistic":
      return (
        <div className="gg-wrap">
          <div className="gg-prose" style={{ marginBottom: "2rem" }}>
            <p>
              Stay informed with curated headlines from global markets, policy, and
              business. This is the same insight section featured on {name}. Each item links to
              its original publisher.
            </p>
            <p>
              Verified members also see portfolio and platform statistics inside the{" "}
              <a href={authLoginUrl}>dashboard</a>: balances, plan performance,
              copy-trading history, and transaction records.
            </p>
          </div>
          <div className="gg-news">
            {STATISTIC_NEWS.map((item) => (
              <a key={item.href} href={item.href} rel="noopener noreferrer">
                <strong>{item.title}</strong>
                <span>{item.source}</span>
              </a>
            ))}
          </div>
        </div>
      );

    case "terms":
      return (
        <div className="gg-wrap gg-prose gg-panel gg-pad">
          <p>
            This is the website of {name} Asset Management and its global affiliates
            (collectively &ldquo;{name}&rdquo;). By using this website you confirm that
            you have read and agree to the following terms. If you do not agree, you may
            not use this website or access any information contained on it.
          </p>
          <p>
            {name} consists of an international group working in project management and
            financial markets, with the purpose of helping people use technology and
            professional support toward their goals.
          </p>
          <p>
            A user&apos;s activities on and after the active date must be in accord with
            these policies and procedures. These policies and the {name} reward plan
            combine to form a contract legally binding upon each user and {name}.
          </p>
          <h3>Withdrawals and verification</h3>
          <p>
            Large withdrawals may require additional verification steps to protect your
            account and comply with processing rules. Fees and holding periods, if any,
            are disclosed in the member area before you confirm a withdrawal.
          </p>
          <h3>Trading services</h3>
          <p>
            {name} provides live trading, forex, cryptocurrency, stock, and commodity
            access together with structured investment plans. Copy trading is optional;
            where offered, commission or fee terms are shown at subscription time. All
            trading and investment products carry risk; past performance does not
            guarantee future results.
          </p>
          <p>
            By accepting these terms in the online enrolment process, you certify that
            you are 18 years of age or older and competent to enter a contract. {name}{" "}
            enters this contract with confidence in its users&apos; integrity and
            responsibility.
          </p>
          <PublicProseCta label="Accept terms & register" />
        </div>
      );

    case "privacy":
      return (
        <div className="gg-wrap gg-prose gg-panel gg-pad">
          <h2>Your privacy</h2>
          <p>
            {name} respects your privacy. This policy describes how we collect, use, and
            protect personal information when you use our website and member services.
          </p>
          <h3>Information we collect</h3>
          <ul>
            <li>Account registration data (name, email, contact details)</li>
            <li>Verification documents when KYC is enabled</li>
            <li>Transaction, deposit, and withdrawal records</li>
            <li>Technical logs (IP address, device type) for security and fraud prevention</li>
          </ul>
          <h3>How we use information</h3>
          <p>
            We use your data to operate your account, process transactions, send
            service-related notices, improve platform security, and comply with applicable
            law. We do not sell personal data to third-party marketers.
          </p>
          <h3>Sharing</h3>
          <p>
            We may share information with payment processors, email providers, and cloud
            hosting partners strictly to deliver the service. We require appropriate
            safeguards from those providers.
          </p>
          <h3>Your rights</h3>
          <p>
            You may request access, correction, or deletion of personal data where
            applicable law allows. Contact{" "}
            <a href={`mailto:${email}`}>{email}</a> for privacy requests.
          </p>
          <h3>Security</h3>
          <p>
            We use encryption in transit, access controls, and monitoring to protect
            member accounts. You are responsible for keeping your password confidential
            and enabling two-factor authentication when offered.
          </p>
        </div>
      );

    default:
      return null;
  }
}
