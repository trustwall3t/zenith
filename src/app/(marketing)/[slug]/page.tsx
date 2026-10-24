import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicSlugBody } from "@/content/PublicSlugBody";
import {
  isPublicSlug,
  PUBLIC_SLUGS,
  SLUG_META,
} from "@/content/public-slugs";
import { getPublicSite } from "@/lib/public/home-payload";
import { notFound } from "next/navigation";

export const revalidate = 300;

export function generateStaticParams() {
  return PUBLIC_SLUGS.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!isPublicSlug(slug)) return {};
  const meta = SLUG_META[slug];
  const site = await getPublicSite();
  return {
    title: `${meta.title} | ${site.siteName}`,
  };
}

export default async function PublicSlugPage({ params }: Props) {
  const { slug } = await params;
  if (!isPublicSlug(slug)) notFound();

  const site = await getPublicSite();
  const meta = SLUG_META[slug];

  return (
    <PublicPageShell
      site={site}
      title={meta.title}
      kicker={meta.kicker}
      lead={meta.lead}
    >
      <PublicSlugBody slug={slug} site={site} />
    </PublicPageShell>
  );
}
