"use server";

import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function setGoogleTranslateEnabled(enabled: boolean) {
  const admin = await getAdminSession();
  if (!admin) {
    return { ok: false as const, error: "Unauthorized" };
  }

  await db.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      siteName: "Zenith Aurex",
      currency: "$",
      welcomeMessage: "Welcome",
      googleTranslate: enabled,
    },
    update: { googleTranslate: enabled },
  });

  revalidatePath("/", "layout");
  return { ok: true as const };
}
