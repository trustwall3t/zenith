"use server";

import { db } from "@/lib/db";
import { sendRawEmail } from "@/lib/email";
import { z } from "zod";

const AdminEmailSchema = z.object({
  userId: z.string().min(1),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function sendUserEmail(data: z.infer<typeof AdminEmailSchema>) {
  const parsed = AdminEmailSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid email fields." };
  }

  const user = await db.user.findUnique({
    where: { id: parsed.data.userId },
    select: { email: true, name: true },
  });
  if (!user) {
    return { error: "User not found." };
  }

  const html = `
    <h1>${parsed.data.subject}</h1>
    <p>Hello ${user.name},</p>
    <p>${parsed.data.message.replace(/\n/g, "<br/>")}</p>
  `;

  const result = await sendRawEmail(user.email, parsed.data.subject, html);
  if (!result.success) {
    return { error: result.error ?? "Failed to send email." };
  }
  return { success: true };
}
