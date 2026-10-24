import type { HomePayload } from "@/types/site";

function tickerRows(marketQuotes: HomePayload["marketQuotes"]) {
  const rows: Array<{
    symbol: string;
    name: string;
    price_label: string;
    change_label?: string;
    change_class?: string;
    logo?: string;
  }> = [];
  for (const group of ["crypto", "stocks"] as const) {
    const block = marketQuotes?.[group];
    if (!block?.ok || !Array.isArray(block.rows)) continue;
    for (const row of block.rows) {
      if (row?.symbol && row?.price_label) {
        rows.push({
          symbol: String(row.symbol),
          name: String(row.name ?? row.symbol),
          price_label: String(row.price_label),
          change_label: row.change_label ? String(row.change_label) : undefined,
          change_class: row.change_class
            ? String(row.change_class)
            : row.dir
              ? `gg-market-ticker-change--${row.dir}`
              : undefined,
          logo: row.logo ? String(row.logo) : undefined,
        });
      }
    }
  }
  return rows;
}

export function MarketTicker({
  marketQuotes,
}: {
  marketQuotes: HomePayload["marketQuotes"];
}) {
  const rows = tickerRows(marketQuotes);
  if (rows.length === 0) return null;

  return (
    <section className="gg-market-ticker" aria-label="Live crypto and stock quotes">
      <div className="gg-market-ticker-viewport">
        <div className="gg-market-ticker-marquee">
          {[1, 2].map((copy) => (
            <ul
              key={copy}
              className="gg-market-ticker-set"
              aria-hidden={copy === 2 ? true : undefined}
            >
              {rows.map((quote) => (
                <li key={`${copy}-${quote.symbol}`} className="gg-market-ticker-item">
                  {quote.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="gg-market-ticker-logo"
                      src={quote.logo}
                      alt=""
                      width={24}
                      height={24}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span
                      className="gg-market-ticker-logo gg-market-ticker-logo--fallback"
                      aria-hidden="true"
                    >
                      {quote.symbol.slice(0, 1)}
                    </span>
                  )}
                  <span className="gg-market-ticker-symbol">{quote.symbol}</span>
                  <span className="gg-market-ticker-name">{quote.name}</span>
                  <span className="gg-market-ticker-price">{quote.price_label}</span>
                  {quote.change_label ? (
                    <span
                      className={`gg-market-ticker-change ${quote.change_class ?? ""}`}
                    >
                      {quote.change_label}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
