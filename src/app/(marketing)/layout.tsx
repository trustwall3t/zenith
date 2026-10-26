import { MarketingHtmlClass } from "@/components/public/MarketingHtmlClass";
import { MarketingThemeGuard } from "@/components/public/MarketingThemeGuard";
import { PublicBootGate } from "@/components/public/PublicBootGate";
import { getPublicSite } from "@/lib/public/home-payload";
import { SITE_LOGO_URL } from "@/lib/public/site-logo";
import { GG_LAYOUT_WIDTH } from "@/lib/public/gg-layout-width";
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
      "Regulated broker in copy trading and investment plans.",
    icons: { icon: SITE_LOGO_URL },
  };
}

const GG_CRITICAL_CSS = `
html.gg-public-root.gg-desktop-boot{background:#faf9f7}
html.gg-public-root.gg-desktop-boot:not(.gg-desktop-ready) .gg-shell{visibility:hidden}
html.gg-public-root.gg-desktop-ready .gg-shell{visibility:visible}
html.gg-public-root.gg-desktop-lock .gg-nav-toggle{display:none!important}
html.gg-public-root.gg-desktop-lock .gg-nav{display:flex!important;position:static!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;padding:0!important;border-bottom:none!important}
html.gg-public-root.gg-desktop-lock .gg-header-inner{flex-wrap:nowrap!important;position:static!important}
html.gg-public-root.gg-desktop-lock .gg-split{grid-template-columns:1.05fr 0.95fr!important}
html.gg-public-root.gg-desktop-lock .gg-plans-rail{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}
html.gg-public-root.gg-desktop-lock .gg-tp-track{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;overflow:visible!important;scroll-snap-type:none!important}
html.gg-public-root,html.gg-public-root body.gg-public{max-width:none;overflow-x:hidden}
body.gg-public{min-width:0;margin:0}
`;

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const site = await getPublicSite();

  return (
    <>
      <style id="gg-desktop-lock-critical" dangerouslySetInnerHTML={{ __html: GG_CRITICAL_CSS }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,620&family=IBM+Plex+Sans:wght@400;500;600&display=optional"
      />
      <link rel="stylesheet" href="/main/css/font-awesome.min.css" />
      <link rel="stylesheet" href="/main/css/home.css" />
      <link rel="stylesheet" href="/main/css/gg-desktop-lock.css" />
      <noscript>
        <style>{`html.gg-public-root.gg-desktop-boot .gg-shell{visibility:visible!important}`}</style>
      </noscript>
      <MarketingThemeGuard>
        <PublicBootGate />
        <MarketingHtmlClass />
        {children}
      </MarketingThemeGuard>
    </>
  );
}
