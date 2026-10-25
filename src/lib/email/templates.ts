import {
  detailRow,
  formatUsd,
  getPublicBaseUrl,
  paragraph,
  renderInstitutionalEmail,
  tokenBlock,
} from "@/lib/email/email-layout";

export type EmailTemplate = {
  subject: string;
  html: string;
};

function verifyUrl(email: string): string {
  return `${getPublicBaseUrl()}/auth/verify?email=${encodeURIComponent(email)}`;
}

export const emailTemplates = {
  welcome: (name: string, email: string, token: string): EmailTemplate => ({
    subject: "Welcome — verify your account",
    html: renderInstitutionalEmail({
      preheader: "Complete email verification to activate your client portal.",
      headline: `Welcome, ${name}`,
      intro:
        "Thank you for registering. Verify your email to access trading, investment plans, and account services.",
      bodyHtml: `
        ${paragraph("Your one-time verification code:")}
        ${tokenBlock(token)}
        ${paragraph("You can also verify using the button below.")}
      `,
      cta: { label: "Verify email address", href: verifyUrl(email) },
      footerNote:
        "If you did not create this account, please disregard this message or contact support.",
    }),
  }),

  resetPassword: (data: { link: string }): EmailTemplate => ({
    subject: "Password reset request",
    html: renderInstitutionalEmail({
      preheader: "Reset your portal password using the secure link below.",
      headline: "Password reset",
      intro:
        "We received a request to reset the password associated with your account.",
      bodyHtml: paragraph(
        "Select the button below to choose a new password. This link is time-limited for your security.",
      ),
      cta: { label: "Reset password", href: data.link },
      footerNote:
        "If you did not request a reset, no action is required. Your password will remain unchanged.",
    }),
  }),

  deposit: (data: { amount: number }): EmailTemplate => ({
    subject: "Deposit request received",
    html: renderInstitutionalEmail({
      preheader: `Deposit request for ${formatUsd(data.amount)} submitted.`,
      headline: "Deposit request received",
      intro:
        "Your deposit request has been logged and is pending review by our operations team.",
      bodyHtml: `
        ${detailRow("Requested amount", formatUsd(data.amount), true)}
        ${detailRow("Status", "Pending review")}
        ${paragraph("You will receive a confirmation once the deposit is approved and credited.")}
      `,
    }),
  }),

  confirmDeposit: (data: { amount: number }): EmailTemplate => ({
    subject: "Deposit confirmed",
    html: renderInstitutionalEmail({
      preheader: `Your deposit of ${formatUsd(data.amount)} has been confirmed.`,
      headline: "Deposit confirmed",
      intro: "Your deposit has been approved and credited to your wallet balance.",
      bodyHtml: `
        ${detailRow("Amount credited", formatUsd(data.amount), true)}
        ${detailRow("Status", "Completed")}
        ${paragraph("Sign in to your dashboard to view your updated balance and transaction history.")}
      `,
      cta: { label: "View dashboard", href: `${getPublicBaseUrl()}/dashboard` },
    }),
  }),

  withdraw: (data: { amount: number }): EmailTemplate => ({
    subject: "Withdrawal request received",
    html: renderInstitutionalEmail({
      preheader: `Withdrawal request for ${formatUsd(data.amount)} submitted.`,
      headline: "Withdrawal request received",
      intro:
        "Your withdrawal request is queued for processing in accordance with our settlement procedures.",
      bodyHtml: `
        ${detailRow("Requested amount", formatUsd(data.amount), true)}
        ${detailRow("Status", "Pending processing")}
        ${paragraph("You will be notified when the withdrawal has been completed.")}
      `,
    }),
  }),

  confirmWithdraw: (data: { amount: number }): EmailTemplate => ({
    subject: "Withdrawal completed",
    html: renderInstitutionalEmail({
      preheader: `Withdrawal of ${formatUsd(data.amount)} has been processed.`,
      headline: "Withdrawal completed",
      intro: "Your withdrawal request has been processed successfully.",
      bodyHtml: `
        ${detailRow("Amount sent", formatUsd(data.amount), true)}
        ${detailRow("Status", "Completed")}
        ${paragraph("Allow standard banking timelines for funds to appear in your destination account.")}
      `,
    }),
  }),

  trade: (data: {
    amount: number;
    symbol: string;
    type: string;
  }): EmailTemplate => ({
    subject: "Trade execution notice",
    html: renderInstitutionalEmail({
      preheader: `Trade executed: ${data.symbol} (${data.type}).`,
      headline: "Trade execution notice",
      intro: "The following trade has been recorded on your account.",
      bodyHtml: `
        ${detailRow("Instrument", data.symbol)}
        ${detailRow("Order type", data.type)}
        ${detailRow("Notional value", formatUsd(data.amount), true)}
        ${detailRow("Status", "Executed")}
      `,
      cta: {
        label: "Trading history",
        href: `${getPublicBaseUrl()}/dashboard/trading-history`,
      },
    }),
  }),

  AdminNotification: (data: {
    amount: number;
    type: "deposit" | "withdraw";
  }): EmailTemplate => {
    const title =
      data.type === "deposit" ? "New deposit request" : "New withdrawal request";
    return {
      subject: `[Admin] ${title}`,
      html: renderInstitutionalEmail({
        preheader: `${title} — ${formatUsd(data.amount)}.`,
        headline: title,
        intro: "A client transaction requires review in the admin console.",
        bodyHtml: `
          ${detailRow("Type", data.type === "deposit" ? "Deposit" : "Withdrawal")}
          ${detailRow("Amount", formatUsd(data.amount), true)}
          ${detailRow("Action required", "Review & approve")}
        `,
        cta: {
          label: "Open admin console",
          href: `${getPublicBaseUrl()}/admin/dashboard/transactions`,
        },
      }),
    };
  },

  referralBonus: (data: { amount: number }): EmailTemplate => ({
    subject: "Referral reward credited",
    html: renderInstitutionalEmail({
      preheader: `Referral bonus of ${formatUsd(data.amount)} credited.`,
      headline: "Referral reward",
      intro: "A referral bonus has been credited to your account.",
      bodyHtml: `
        ${detailRow("Bonus amount", formatUsd(data.amount), true)}
        ${detailRow("Status", "Credited")}
      `,
      cta: { label: "View wallet", href: `${getPublicBaseUrl()}/dashboard` },
    }),
  }),

  resendToken: (data: { token: string; email: string }): EmailTemplate => ({
    subject: "Your verification code",
    html: renderInstitutionalEmail({
      preheader: "Use this code to verify your email address.",
      headline: "Email verification",
      intro: "Enter the code below or use the verification link.",
      bodyHtml: `
        ${detailRow("Account", data.email)}
        ${tokenBlock(data.token)}
      `,
      cta: { label: "Verify email", href: verifyUrl(data.email) },
      footerNote: "If you did not request this code, you can safely ignore this email.",
    }),
  }),
};

export type EmailTemplateName = keyof typeof emailTemplates;

export type EmailData = {
  welcome: { name: string; email: string; token: string };
  resetPassword: { link: string };
  deposit: { amount: number };
  confirmDeposit: { amount: number };
  withdraw: { amount: number };
  confirmWithdraw: { amount: number };
  trade: { amount: number; symbol: string; type: string };
  AdminNotification: { amount: number; type: "deposit" | "withdraw" };
  referralBonus: { amount: number };
  resendToken: { token: string; email: string };
};

/** Admin free-form message wrapped in institutional layout. */
export function renderAdminCustomEmail(
  subject: string,
  recipientName: string,
  messageHtml: string,
): string {
  return renderInstitutionalEmail({
    preheader: subject,
    headline: subject,
    intro: `Dear ${recipientName},`,
    bodyHtml: messageHtml,
  });
}
