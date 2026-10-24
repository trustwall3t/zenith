import { z } from "zod";

export const dashboardSettingSchema = z.object({
  siteName  : z.string().optional(),
  siteDescription: z.string().optional(),
  withdrawalLimit: z.number().optional(),
  siteTitle: z.string().optional(),
  siteLogo: z.string().optional(),
  siteFavicon: z.string().optional(),
  siteEmail: z.string().optional(),
  sitePhone: z.string().optional(),
  siteAddress: z.string().optional(),
  copyrightYear: z.number().optional(),
});

