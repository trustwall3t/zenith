"use server";

import { getAdminSession } from "@/lib/admin-auth";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function loginAsUser(
  userId: string,
): Promise<{ ok: false; error: string } | void> {
  const admin = await getAdminSession();
  if (!admin) {
    return { ok: false, error: "Admin session required." };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) {
    return { ok: false, error: "User not found." };
  }

  await db.session.deleteMany({ where: { userId } });
  await createSession(userId, { impersonatedByAdminId: admin.adminId });
  redirect("/dashboard");
}

export async function exitUserImpersonation(userId?: string) {
  const session = await getSession();
  if (session?.impersonatedByAdminId) {
    await deleteSession();
  }
  redirect(
    userId ? `/admin/dashboard/users/${userId}` : "/admin/dashboard/users",
  );
}
