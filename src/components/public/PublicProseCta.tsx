import { authSignupUrl } from "@/lib/public/auth-links";

export function PublicProseCta({
  label = "Open an account",
  hint,
}: {
  label?: string;
  hint?: string;
}) {
  return (
    <div className="gg-prose-cta">
      <a className="gg-btn gg-btn-solid" href={authSignupUrl}>
        {label}
      </a>
      {hint ? <p className="gg-prose-cta-hint">{hint}</p> : null}
    </div>
  );
}
