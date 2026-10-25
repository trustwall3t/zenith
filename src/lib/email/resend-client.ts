import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

/** Resend `from` — use `Name <email@domain.com>` or set EMAIL_FROM_NAME + bare email. */
export function getDefaultFromAddress(): string | null {
  const raw = process.env.EMAIL_FROM?.trim();
  if (!raw) return null;
  if (raw.includes("<") && raw.includes(">")) return raw;
  const name = process.env.EMAIL_FROM_NAME?.trim() || "Support";
  return `${name} <${raw}>`;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && getDefaultFromAddress());
}

export type SendMailResult =
  | { success: true; id?: string }
  | { success: false; error: string };

export async function sendMail(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<SendMailResult> {
  const client = getResend();
  const from = options.from ?? getDefaultFromAddress();

  if (!client || !from) {
    console.warn("[email] RESEND_API_KEY or EMAIL_FROM is not configured");
    return { success: false, error: "Email not configured" };
  }

  const replyTo =
    options.replyTo?.trim() ||
    process.env.EMAIL_REPLY_TO?.trim() ||
    undefined;

  try {
    const { data, error } = await client.emails.send({
      from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      replyTo,
    });

    if (error) {
      console.error("[email] Resend API error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[email] Resend send failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send email",
    };
  }
}
