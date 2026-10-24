import type { SiteInfo, Testimonial } from "@/types/site";

export function TrustpilotReviews({
  site,
  testimonials,
}: {
  site: SiteInfo;
  testimonials: Testimonial[];
}) {
  const hasReviews = testimonials.length > 0;

  return (
    <section className="gg-section gg-trustpilot-section" aria-labelledby="gg-trustpilot-heading">
      <div className="gg-wrap">
        <header className="gg-tp-head">
          <h2 id="gg-trustpilot-heading">
            What investors say about {site.siteName}
          </h2>
          <div className="gg-tp-badge-row">
            <span className="gg-tp-badge-label gg-tp-badge-label--real">
              Real client testimonials
            </span>
            {hasReviews ? (
              <div
                className="gg-tp-star-tiles"
                role="img"
                aria-label="Five out of five stars on client testimonials"
              >
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="gg-tp-star-tile" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" focusable="false">
                      <path
                        fill="currentColor"
                        d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.56 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z"
                      />
                    </svg>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <p className="gg-tp-lead">
            {hasReviews
              ? "Real testimonials from our clients — shared with their permission."
              : `Customer reviews will appear here as clients share their experience with ${site.siteName}.`}
          </p>
        </header>

        {hasReviews ? (
          <div className="gg-tp-reviews-shell">
            <div
              className="gg-tp-track"
              data-gg-reviews-carousel
              tabIndex={0}
              role="region"
              aria-label="Customer review cards"
            >
              {testimonials.map((review) => (
                <article key={review.id ?? review.name} className="gg-tp-card">
                  <header className="gg-tp-card-consumer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="gg-tp-card-avatar"
                      src={review.avatarUrl}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="gg-tp-card-consumer-text">
                      <h3 className="gg-tp-card-name">{review.name}</h3>
                    </div>
                  </header>
                  <h4 className="gg-tp-card-title">{review.title}</h4>
                  <p className="gg-tp-card-body">{review.body}</p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="gg-tp-empty" role="status">
            Customer reviews will appear here.
          </p>
        )}
      </div>
    </section>
  );
}
