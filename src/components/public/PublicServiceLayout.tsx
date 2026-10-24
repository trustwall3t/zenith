import { PublicServiceTrustBar } from "@/components/public/PublicServiceTrustBar";
import { PublicServicesSidebar } from "@/components/public/PublicServicesSidebar";
import type { ReactNode } from "react";

/** Zenith inner page: main article + services sidebar. */
export function PublicServiceLayout({
  children,
  brandName,
}: {
  children: ReactNode;
  brandName: string;
}) {
  return (
    <div className="gg-wrap gg-layout">
      <article className="gg-prose">
        {children}
        <PublicServiceTrustBar brandName={brandName} />
      </article>
      <PublicServicesSidebar />
    </div>
  );
}
