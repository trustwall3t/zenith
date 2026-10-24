import Script from "next/script";
import { GG_LAYOUT_WIDTH } from "@/lib/public/gg-layout-width";

/** Zenith Growth: 1200px desktop layout scaled to fit every device via viewport meta. */
export function DesktopViewport() {
  const layoutWidth = GG_LAYOUT_WIDTH;

  return (
    <>
      <Script id="gg-viewport-meta" strategy="beforeInteractive">
        {`(function () {
          var layoutWidth = ${layoutWidth};
          var root = document.documentElement;
          if (!root.classList.contains("gg-public-root")) return;
          document.querySelectorAll('meta[name="viewport"]').forEach(function (m) {
            if (!m.getAttribute("data-gg-fit")) m.remove();
          });
          if (document.querySelector('meta[name="viewport"][data-gg-fit]')) return;

          var deviceWidth =
            window.screen && window.screen.width ? window.screen.width : 390;
          var scale = Math.min(1, deviceWidth / layoutWidth);
          scale = Math.round(scale * 10000) / 10000;

          var meta = document.createElement("meta");
          meta.name = "viewport";
          meta.setAttribute("data-gg-fit", "1");
          meta.setAttribute("data-layout-width", String(layoutWidth));
          meta.content =
            "width=" +
            layoutWidth +
            ", initial-scale=" +
            scale +
            ", minimum-scale=" +
            scale +
            ", maximum-scale=5, user-scalable=yes, viewport-fit=cover";
          document.head.appendChild(meta);

          root.classList.add("gg-desktop-lock");
          root.style.setProperty("--gg-desktop-lock-width", layoutWidth + "px");
          function markBody() {
            if (document.body) {
              document.body.classList.add("gg-desktop-lock");
            }
          }
          markBody();
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", markBody, { once: true });
          }
        })();`}
      </Script>
      <Script src="/main/js/gg-desktop-viewport-fit.js" strategy="beforeInteractive" />
    </>
  );
}
