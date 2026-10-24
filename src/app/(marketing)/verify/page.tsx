import { redirect } from "next/navigation";

/** Zenith `/verify` gate → app signup (captcha handled in auth flow). */
export default function VerifyRedirectPage() {
  redirect("/auth/signup");
}
