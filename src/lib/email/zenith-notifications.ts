import {
  detailRow,
  escapeHtml,
  formatUsd,
  getPublicBaseUrl,
  paragraph,
  renderInstitutionalEmail,
} from "@/lib/email/email-layout";
import { isEmailConfigured, sendMail } from "@/lib/email/resend-client";

export async function sendRoiEmail(opts: {
  to: string;
  name: string;
  planName: string;
  amount: number;
  currency: string;
}) {
  if (!isEmailConfigured()) return;

  const amountLabel =
    opts.currency.trim() === "$" || opts.currency.toUpperCase() === "USD"
      ? formatUsd(opts.amount)
      : `${escapeHtml(opts.currency)}${opts.amount.toLocaleString()}`;

  await sendMail({
    to: opts.to,
    subject: "ROI distribution notice",
    html: renderInstitutionalEmail({
      preheader: `ROI credited: ${opts.planName}.`,
      headline: "Return on investment",
      intro: `Dear ${opts.name}, a scheduled return has been credited to your account.`,
      bodyHtml: `
        ${detailRow("Investment plan", opts.planName)}
        ${detailRow("Distribution amount", amountLabel, true)}
        ${detailRow("Status", "Credited")}
        ${paragraph("This distribution is reflected in your wallet and transaction history.")}
      `,
      cta: { label: "View my plans", href: `${getPublicBaseUrl()}/dashboard/plans` },
    }),
  });
}

export async function sendPlanClosedEmail(opts: {
  to: string;
  name: string;
  planName: string;
  amount: number;
  currency: string;
  siteName: string;
}) {
  if (!isEmailConfigured()) return;

  const principal =
    opts.currency.trim() === "$" || opts.currency.toUpperCase() === "USD"
      ? formatUsd(opts.amount)
      : `${escapeHtml(opts.currency)}${opts.amount.toLocaleString()}`;

  await sendMail({
    to: opts.to,
    subject: "Investment plan matured",
    html: renderInstitutionalEmail({
      preheader: `Plan closed: ${opts.planName}.`,
      headline: "Investment plan matured",
      intro: `Dear ${opts.name}, your investment plan term has ended.`,
      bodyHtml: `
        ${detailRow("Plan", opts.planName)}
        ${detailRow("Principal", principal)}
        ${detailRow("Status", "Closed")}
        ${paragraph(`Thank you for investing with ${opts.siteName}.`)}
      `,
      cta: { label: "Explore plans", href: `${getPublicBaseUrl()}/dashboard/plans` },
    }),
  });
}

export async function sendCopyTradeOpened(opts: {
  to: string;
  symbol: string;
  direction: string;
  stake: number;
}) {
  if (!isEmailConfigured()) return;

  await sendMail({
    to: opts.to,
    subject: "Position opened — copy trade",
    html: renderInstitutionalEmail({
      preheader: `New ${opts.symbol} copy position opened.`,
      headline: "Copy trade opened",
      intro: "A new copy-trading position has been opened on your account.",
      bodyHtml: `
        ${detailRow("Instrument", opts.symbol)}
        ${detailRow("Direction", opts.direction.toUpperCase())}
        ${detailRow("Stake", formatUsd(opts.stake), true)}
        ${detailRow("Status", "Open")}
      `,
      cta: {
        label: "Live trading",
        href: `${getPublicBaseUrl()}/dashboard/live-trading`,
      },
    }),
  });
}

export async function sendCopyTradeClosed(opts: {
  to: string;
  symbol: string;
  status: string;
  profit: number;
}) {
  if (!isEmailConfigured()) return;

  const pl = formatUsd(Math.abs(opts.profit));
  const plLabel =
    opts.profit > 0 ? `+${pl}` : opts.profit < 0 ? `-${pl}` : pl;

  await sendMail({
    to: opts.to,
    subject: "Position closed — copy trade",
    html: renderInstitutionalEmail({
      preheader: `${opts.symbol} copy trade closed (${opts.status}).`,
      headline: "Copy trade closed",
      intro: "Your copy-trading position has settled.",
      bodyHtml: `
        ${detailRow("Instrument", opts.symbol)}
        ${detailRow("Outcome", opts.status)}
        ${detailRow("Profit / loss", plLabel, opts.profit >= 0)}
        ${detailRow("Status", "Closed")}
      `,
      cta: {
        label: "Trading history",
        href: `${getPublicBaseUrl()}/dashboard/trading-history`,
      },
    }),
  });
}
