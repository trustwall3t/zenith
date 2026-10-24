"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function setUserDisabled(userId: string, disabled: boolean) {
  const user = await db.user.update({
    where: { id: userId },
    data: { isDisabled: disabled },
  });

  if (disabled) {
    await db.session.deleteMany({ where: { userId } });
  }

  revalidatePath("/admin/dashboard/users");
  revalidatePath(`/admin/dashboard/users/${userId}`);
  return { success: true, userId: user.id, isDisabled: user.isDisabled };
}

export async function setUserVerified(userId: string, verified: boolean) {
  const user = await db.user.update({
    where: { id: userId },
    data: {
      isVerified: verified,
      confirm: verified ? "true" : "false",
    },
  });

  revalidatePath("/admin/dashboard/users");
  revalidatePath(`/admin/dashboard/users/${userId}`);
  return { success: true, isVerified: user.isVerified };
}

export async function setUserTradeMode(userId: string, mode: "on" | "off") {
  const user = await db.user.update({
    where: { id: userId },
    data: { tradeMode: mode },
  });

  revalidatePath("/admin/dashboard/users");
  return { success: true, tradeMode: user.tradeMode };
}

export async function deleteUserById(id: string) {
  await db.session.deleteMany({ where: { userId: id } });
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/dashboard/users");
  return { success: true };
}
