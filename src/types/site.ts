export type SiteInfo = {
  siteName: string;
  siteTitle: string;
  description: string;
  welcomeMessage: string;
  currency: string;
  logoUrl: string | null;
  googleTranslate: boolean;
  redirectUrl: string | null;
  contactEmail?: string | null;
};

export type Plan = {
  id: number;
  name: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  incrementAmount: string | number;
  incrementInterval: string;
};

export type Testimonial = {
  id: number | null;
  name: string;
  title: string;
  body: string;
  avatarUrl: string;
  reviewedAt?: string | null;
};

export type MarketQuotesPayload = {
  crypto?: { ok?: boolean; rows?: Record<string, string>[] };
  stocks?: { ok?: boolean; rows?: Record<string, string>[] };
};

export type HomeStats = {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
};

export type HomePayload = {
  site: SiteInfo;
  plans: Plan[];
  marketQuotes: MarketQuotesPayload;
  testimonials: Testimonial[];
  stats: HomeStats | null;
};
