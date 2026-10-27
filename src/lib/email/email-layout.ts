/** Institutional HTML email shell (table layout for client compatibility). */

const BRAND_PRIMARY = "#3730a3";
const BRAND_PRIMARY_DARK = "#2a2480";
const TEXT_PRIMARY = "#1a2332";
const TEXT_MUTED = "#5c6573";
const BORDER = "#e2e6ec";
const BG_PAGE = "#eef0f4";
const BG_CARD = "#ffffff";
const SUCCESS = "#0d7a4f";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getPublicBaseUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}

export function getEmailSiteName(): string {
  return (
    process.env.EMAIL_FROM_NAME?.trim() ||
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() ||
    "Zenith Aurex"
  );
}

export function getEmailLogoUrl(): string {
  const custom = process.env.EMAIL_LOGO_URL?.trim();
  if (custom) {
    if (custom.startsWith("http")) return custom;
    return `${getPublicBaseUrl()}${custom.startsWith("/") ? "" : "/"}${custom}`;
  }
  return `${getPublicBaseUrl()}/logo.png`;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type InstitutionalEmailOptions = {
  preheader: string;
  headline: string;
  intro?: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
};

export function renderInstitutionalEmail(
  options: InstitutionalEmailOptions,
): string {
  const siteName = escapeHtml(getEmailSiteName());
  const logoUrl = escapeHtml(getEmailLogoUrl());
  const year = new Date().getFullYear();
  const preheader = escapeHtml(options.preheader);
  const headline = escapeHtml(options.headline);
  const intro = options.intro ? escapeHtml(options.intro) : "";
  const footerNote = options.footerNote
    ? `<p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:${TEXT_MUTED};">${escapeHtml(options.footerNote)}</p>`
    : "";

  const ctaBlock = options.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
  <tr>
    <td align="center" bgcolor="${BRAND_PRIMARY}" style="border-radius:6px;">
      <a href="${escapeHtml(options.cta.href)}" target="_blank" rel="noopener noreferrer"
        style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
        ${escapeHtml(options.cta.label)}
      </a>
    </td>
  </tr>
</table>`
    : "";

  const introBlock = intro
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:${TEXT_MUTED};">${intro}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${headline}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BG_PAGE};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}${"&#847;&nbsp;".repeat(24)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG_PAGE};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 16px;text-align:center;">
              <img src="${logoUrl}" width="160" alt="${siteName}" style="display:inline-block;max-width:160px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td bgcolor="${BG_CARD}" style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(26,35,50,0.06);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${BRAND_PRIMARY}" style="height:4px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:36px 40px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
                    <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3;font-weight:600;color:${TEXT_PRIMARY};letter-spacing:-0.02em;">${headline}</h1>
                    <p style="margin:0 0 24px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${BRAND_PRIMARY};">${siteName}</p>
                    ${introBlock}
                    <div style="font-size:15px;line-height:1.65;color:${TEXT_PRIMARY};">
                      ${options.bodyHtml}
                    </div>
                    ${ctaBlock}
                    ${footerNote}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;line-height:1.5;color:${TEXT_MUTED};">
                This message was sent by ${siteName}. For account security, never share passwords or verification codes.
              </p>
              <p style="margin:0;font-size:11px;line-height:1.5;color:${TEXT_MUTED};">
                &copy; ${year} ${siteName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function detailRow(label: string, value: string, highlight = false): string {
  const valueColor = highlight ? SUCCESS : TEXT_PRIMARY;
  const valueWeight = highlight ? "600" : "500";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
  <tr>
    <td style="padding:12px 16px;background-color:#f7f8fa;border:1px solid ${BORDER};border-radius:6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size:12px;font-weight:500;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(label)}</td>
          <td align="right" style="font-size:15px;font-weight:${valueWeight};color:${valueColor};font-variant-numeric:tabular-nums;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function tokenBlock(token: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
  <tr>
    <td align="center" style="padding:16px 20px;background-color:#f7f8fa;border:1px dashed ${BORDER};border-radius:6px;">
      <span style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:22px;font-weight:600;letter-spacing:0.12em;color:${BRAND_PRIMARY_DARK};">${escapeHtml(token)}</span>
    </td>
  </tr>
</table>
<p style="margin:8px 0 0;font-size:12px;color:${TEXT_MUTED};">This code expires in 10 minutes.</p>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;">${escapeHtml(text)}</p>`;
}

export { BRAND_PRIMARY, TEXT_MUTED };
