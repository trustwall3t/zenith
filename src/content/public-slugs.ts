/** URL slugs matching Zenith Habour `routes/home.php`. */
export const PUBLIC_SLUGS = [
  "about",
  "terms",
  "privacy",
  "futures",
  "forex",
  "stocks",
  "advancetrading",
  "oilandgas",
  "livetrading",
  "softwares",
  "optioncopytrading",
  "contact",
  "faq",
  "statistic",
  "investments",
] as const;

export type PublicSlug = (typeof PUBLIC_SLUGS)[number];

export function isPublicSlug(value: string): value is PublicSlug {
  return (PUBLIC_SLUGS as readonly string[]).includes(value);
}

export type SlugMeta = {
  title: string;
  kicker: string;
  lead?: string;
};

export const SLUG_META: Record<PublicSlug, SlugMeta> = {
  about: {
    title: "About us",
    kicker: "About",
    lead: "Multi-asset trading and investment services with emphasis on Asian market sessions.",
  },
  terms: {
    title: "Terms and conditions",
    kicker: "Terms",
    lead: "Rules governing use of this website and member services.",
  },
  privacy: {
    title: "Privacy policy",
    kicker: "Privacy",
    lead: "How we collect, use, and protect your personal information.",
  },
  futures: {
    title: "Futures trading",
    kicker: "Futures",
    lead: "Index, energy, metal, and agricultural contracts with links to related markets.",
  },
  forex: {
    title: "Forex & cryptocurrencies",
    kicker: "Forex & crypto",
    lead: "Currency pairs with Asian crosses, 24-hour liquidity, and major digital assets.",
  },
  stocks: {
    title: "Stock trading",
    kicker: "Stocks",
    lead: "Global equities education and tools alongside commodities and live quotes.",
  },
  advancetrading: {
    title: "Commodities",
    kicker: "Commodities",
    lead: "Institutional commodity exposure with conservative risk discipline since 2015.",
  },
  oilandgas: {
    title: "Oil and gas",
    kicker: "Oil and gas",
    lead: "Energy sector expertise, stewardship, and structured member participation.",
  },
  livetrading: {
    title: "Live trading",
    kicker: "Live trading",
    lead: "Streamed quotes and timed positions on forex, crypto, indices, and metals.",
  },
  softwares: {
    title: "Retirement planning",
    kicker: "Retirement",
    lead: "Income strategies, compounding, and dashboard tools for life after work.",
  },
  optioncopytrading: {
    title: "Copy trading",
    kicker: "Copy trading",
    lead: "Optional mirrored strategies within a broader forex, crypto, and equities platform.",
  },
  contact: {
    title: "Contact",
    kicker: "Contact",
    lead: "Write to us using the address below. This page also holds our mutual funds note, which is the service linked from the menu.",
  },
  faq: {
    title: "Frequently asked questions",
    kicker: "FAQ",
    lead: "Accounts, live trading, forex, crypto, stocks, commodities, plans, and support.",
  },
  statistic: {
    title: "Our latest news",
    kicker: "Insight",
    lead: "A selection of market and business headlines. Each item opens the original source.",
  },
  investments: {
    title: "Agriculture",
    kicker: "Agriculture",
    lead: "Financing and investment solutions for modern farming and agribusiness.",
  },
};
