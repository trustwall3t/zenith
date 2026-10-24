import { db } from "@/lib/db";
import type { HomePayload, SiteInfo } from "@/types/site";
import {
  emptyMarketQuotes,
  getPublicMarketQuotes,
} from "@/lib/public/market-quotes-public";
import { loadHomeTestimonials } from "@/lib/public/testimonials";
import { SITE_LOGO_URL } from "@/lib/public/site-logo";
import type { HomeStats } from "@/types/site";

const defaultSite: SiteInfo = {
  siteName: "Zenith Growth",
  siteTitle: "Home",
  description: "",
  welcomeMessage: "Welcome — start your mirror trading journey",
  currency: "$",
  logoUrl: SITE_LOGO_URL,
  googleTranslate: false,
  redirectUrl: null,
  contactEmail: null,
};

export async function getPublicSite(): Promise<SiteInfo> {
  try {
    const s = await db.siteSettings.findUnique({ where: { id: "default" } });
    if (!s) return defaultSite;
    return {
      siteName: s.siteName,
      siteTitle: s.siteName,
      description: s.welcomeMessage,
      welcomeMessage: s.welcomeMessage,
      currency: s.currency,
      logoUrl: SITE_LOGO_URL,
      googleTranslate: s.googleTranslate,
      redirectUrl: null,
      contactEmail: s.contactEmail,
    };
  } catch {
    return defaultSite;
  }
}

export async function getHomePayload(): Promise<HomePayload> {
  const site = await getPublicSite();

  let plans: HomePayload["plans"] = [];
  try {
    const rows = await db.investmentPlan.findMany({ orderBy: { id: "asc" } });
    plans = rows.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.planType,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      incrementAmount: p.incrementAmount,
      incrementInterval: p.incrementInterval,
    }));
  } catch {
    plans = [];
  }

  let marketQuotes = emptyMarketQuotes();
  try {
    marketQuotes = await getPublicMarketQuotes();
  } catch {
    marketQuotes = emptyMarketQuotes();
  }

  let stats: HomeStats | null = null;
  try {
    const [totalUsers, depAgg, wdAgg] = await Promise.all([
      db.user.count(),
      db.transaction.aggregate({
        where: { transactionType: "deposit" },
        _sum: { amount: true },
      }),
      db.transaction.aggregate({
        where: { transactionType: "withdraw" },
        _sum: { amount: true },
      }),
    ]);
    stats = {
      totalUsers,
      totalDeposits: depAgg._sum.amount ?? 0,
      totalWithdrawals: wdAgg._sum.amount ?? 0,
    };
  } catch {
    stats = null;
  }

  return {
    site,
    plans,
    marketQuotes,
    testimonials: loadHomeTestimonials(),
    stats,
  };
}
