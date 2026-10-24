import { HeroSection } from "@/components/public/HeroSection";
import { InvestmentPlans } from "@/components/public/InvestmentPlans";
import { MarketTicker } from "@/components/public/MarketTicker";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import {
  HomePageIntroSections,
  HomePageMarketsSection,
  HomePageRestSections,
} from "@/components/public/HomePageSections";
import { TrustpilotReviews } from "@/components/public/TrustpilotReviews";
import { getHomePayload } from "@/lib/public/home-payload";
import Script from "next/script";

export const revalidate = 60;

export default async function MarketingHomePage() {
  const data = await getHomePayload();

  return (
		<div
			className='gg-shell'
			id='gg-public-shell'
		>
			<PublicHeader brandName={data.site.siteName} />
			<main className='gg-main'>
				<HeroSection welcomeMessage={data.site.welcomeMessage} />
				<MarketTicker marketQuotes={data.marketQuotes} />

				<HomePageIntroSections site={data.site} />
				<InvestmentPlans
					plans={data.plans}
					site={data.site}
				/>
				<TrustpilotReviews
					site={data.site}
					testimonials={data.testimonials}
				/>
				<HomePageMarketsSection />
				<HomePageRestSections
					site={data.site}
					stats={data.stats}
				/>
			</main>
			<PublicFooter brandName={data.site.siteName} />
			<Script
				src='/main/js/hero-bg.js'
				strategy='afterInteractive'
			/>
			<Script
				src='/main/js/home-market-ticker.js'
				strategy='afterInteractive'
			/>
			<Script
				src='/main/js/home-reviews-carousel.js'
				strategy='afterInteractive'
			/>
		</div>
  );
}
