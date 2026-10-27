import { MarketingHtmlClass } from "@/components/public/MarketingHtmlClass";
import { MarketingThemeGuard } from "@/components/public/MarketingThemeGuard";
import { PublicBootGate } from "@/components/public/PublicBootGate";
import { getPublicSite } from "@/lib/public/home-payload";
import { SITE_LOGO_URL } from "@/lib/public/site-logo";
import type { Metadata } from "next";
import "../public-marketing.css";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSite();
  return {
    title: {
      default: `${site.siteName} | Welcome`,
      template: `%s | ${site.siteName}`,
    },
    description:
      site.description ||
      site.welcomeMessage ||
      "Live trading, forex, crypto, stocks and commodities with coverage of Asian market sessions.",
    icons: { icon: SITE_LOGO_URL },
  };
}

const GG_CRITICAL_CSS = `
html.gg-desktop-lock .gg-nav-toggle{display:none!important}
html.gg-desktop-lock .gg-nav{display:flex!important;position:static!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;padding:0!important;border-bottom:none!important}
html.gg-desktop-lock .gg-header-inner{flex-wrap:nowrap!important;position:static!important}
html.gg-desktop-lock .gg-split{display:grid!important;grid-template-columns:1fr 1fr!important;gap:2.5rem!important;align-items:center!important}
html.gg-desktop-lock .gg-cards{grid-template-columns:repeat(3,minmax(0,1fr))!important}
html.gg-desktop-lock .gg-plans-bento{grid-template-columns:minmax(0,1.05fr) minmax(0,1.45fr)!important;align-items:start!important}
html.gg-desktop-lock .gg-plans-rail{grid-template-columns:repeat(2,minmax(0,1fr))!important;align-content:start!important}
html.gg-desktop-lock .gg-plan-tier--featured{align-self:start!important;height:auto!important;min-height:0!important}
html.gg-desktop-lock .gg-stats{grid-template-columns:repeat(3,1fr)!important}
html.gg-desktop-lock .gg-footer-grid{grid-template-columns:repeat(4,minmax(160px,1fr))!important}
html.gg-desktop-lock .gg-tp-track{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;overflow:visible!important;scroll-snap-type:none!important}
html.gg-desktop-lock .gg-tp-reviews-shell{max-height:37.5rem!important;overflow-y:auto!important;width:auto!important;margin-inline:0!important}
html.gg-desktop-boot:not(.gg-desktop-ready) body{visibility:hidden}
html.gg-desktop-lock,html.gg-desktop-lock body.gg-public{max-width:none;overflow-x:hidden}
html.gg-desktop-lock body.gg-public{min-width:var(--gg-desktop-lock-width,1200px)}
body.gg-public{margin:0}
`;

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style id="gg-desktop-lock-critical" dangerouslySetInnerHTML={{ __html: GG_CRITICAL_CSS }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      />
      <link rel="stylesheet" href="/main/css/font-awesome.min.css" />
      <link rel="stylesheet" href="/main/css/home.css" />
      <link rel="stylesheet" href="/main/css/gg-desktop-lock.css" />
      <noscript>
        <style>{`html.gg-desktop-boot body{visibility:visible!important}`}</style>
      </noscript>
      <MarketingThemeGuard>
        <PublicBootGate />
        <MarketingHtmlClass />
        {children}
      </MarketingThemeGuard>
    </>
  );
}
