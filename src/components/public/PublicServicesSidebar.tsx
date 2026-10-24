import Link from "next/link";

/** Zenith `home/partials/services.blade.php`. */
export function PublicServicesSidebar() {
  return (
    <aside className="gg-side" aria-label="Services">
      <Link href="/contact">Mutual funds</Link>
      <Link href="/livetrading">Real estate</Link>
      <Link href="/softwares">Retirement</Link>
      <Link href="/investments">Agriculture</Link>
      <Link href="/advancetrading">Commodities</Link>
      <Link href="/oilandgas">Oil and gas</Link>
      <Link href="/stocks">Stocks</Link>
      <Link href="/forex">Forex</Link>
      <Link href="/optioncopytrading">Options copy trading</Link>
    </aside>
  );
}
