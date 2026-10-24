import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import type { SiteInfo } from "@/types/site";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  site: SiteInfo;
  title: string;
  kicker?: string;
  lead?: string;
  children: ReactNode;
};

export function PublicPageShell({
  site,
  title,
  kicker,
  lead,
  children,
}: Props) {
  const trail = kicker ?? title;
  return (
    <div className="gg-shell" id="gg-public-shell">
      <PublicHeader brandName={site.siteName} />
      <main className="gg-main">
        <header className="gg-page-hero">
          <div className="gg-wrap">
            <p className="gg-kicker">
              <Link href="/">Home</Link> · {trail}
            </p>
            <h1>{title}</h1>
            {lead ? <p>{lead}</p> : null}
          </div>
        </header>
        <section className="gg-section gg-section--inner">{children}</section>
      </main>
      <PublicFooter brandName={site.siteName} />
    </div>
  );
}
