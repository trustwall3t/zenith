import Link from "next/link";
import { authLoginUrl, authSignupUrl } from "@/lib/public/auth-links";

type Props = { brandName: string };

export function PublicFooter({ brandName }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="gg-footer">
      <div className="gg-wrap gg-footer-grid">
        <div>
          <h2>{brandName}</h2>
          <p>
            We are an award winning multinational company. We believe in quality
            and standard worldwide.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/statistic">Insight</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Account</h2>
          <ul>
            <li>
              <a href={authLoginUrl}>Log in</a>
            </li>
            <li>
              <a href={authSignupUrl}>Register</a>
            </li>
            <li>
              <Link href="/terms">Terms and conditions</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="gg-wrap gg-copy">
        Copyright © {year} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}
