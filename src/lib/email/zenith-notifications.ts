import nodemailer from "nodemailer";

function transporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 465),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendRoiEmail(opts: {
  to: string;
  name: string;
  planName: string;
  amount: number;
  currency: string;
}) {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!from || !process.env.EMAIL_USER) return;

  await transporter().sendMail({
    from,
    to: opts.to,
    subject: "New Return on Investment (ROI)",
    html: `<p>Hi ${opts.name},</p>
<p>Your plan <strong>${opts.planName}</strong> earned ${opts.currency}${opts.amount.toLocaleString()}.</p>`,
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
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!from || !process.env.EMAIL_USER) return;

  await transporter().sendMail({
    from,
    to: opts.to,
    subject: "Investment plan closed",
    html: `<p>Hi ${opts.name},</p>
<p>Your investment plan <strong>${opts.planName}</strong> (${opts.currency}${opts.amount.toLocaleString()}) has closed.</p>
<p>— ${opts.siteName}</p>`,
  });
}

export async function sendCopyTradeOpened(opts: {
  to: string;
  symbol: string;
  direction: string;
  stake: number;
}) {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!from || !process.env.EMAIL_USER) return;

  await transporter().sendMail({
    from,
    to: opts.to,
    subject: "Copy trade opened",
    html: `<p>A copy trade on <strong>${opts.symbol}</strong> (${opts.direction}) opened with stake $${opts.stake.toFixed(2)}.</p>`,
  });
}

export async function sendCopyTradeClosed(opts: {
  to: string;
  symbol: string;
  status: string;
  profit: number;
}) {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!from || !process.env.EMAIL_USER) return;

  await transporter().sendMail({
    from,
    to: opts.to,
    subject: "Copy trade closed",
    html: `<p>Your <strong>${opts.symbol}</strong> trade closed as <strong>${opts.status}</strong>. P/L: $${opts.profit.toFixed(2)}.</p>`,
  });
}
