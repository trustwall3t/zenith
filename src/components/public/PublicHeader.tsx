import Link from "next/link";
import { authLoginUrl, authSignupUrl } from "@/lib/public/auth-links";
import { SITE_LOGO_URL_ON_LIGHT_BG } from "@/lib/public/site-logo";

type Props = {
  brandName: string;
};

export function PublicHeader({ brandName }: Props) {
  return (
    <header className="gg-header">
      <div className="gg-header-inner">
        <Link className="gg-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gg-brand-logo"
            src={SITE_LOGO_URL_ON_LIGHT_BG}
            alt={brandName}
            width={44}
            height={44}
          />
        </Link>
        <div className="gg-header-end">
          <nav className="gg-nav" id="gg-nav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <details>
              <summary>Markets</summary>
              <div className="gg-drop">
                <Link href="/optioncopytrading">Options copy trading</Link>
                <Link href="/stocks">Stocks</Link>
                <Link href="/forex">Forex</Link>
              </div>
            </details>
            <details>
              <summary>Services</summary>
              <div className="gg-drop">
                <Link href="/contact">Mutual funds</Link>
                <Link href="/livetrading">Real estate</Link>
                <Link href="/softwares">Retirement</Link>
              </div>
            </details>
            <Link href="/contact">Contact</Link>
          </nav>
          <a className="gg-btn gg-btn-ghost" href={authLoginUrl}>
            Login
          </a>
          <a className="gg-btn gg-btn-primary" href={authSignupUrl}>
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}
