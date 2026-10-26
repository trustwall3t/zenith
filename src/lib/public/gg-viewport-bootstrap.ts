import { GG_LAYOUT_WIDTH } from "@/lib/public/gg-layout-width";

/**
 * Runs synchronously in <head> on marketing pages — must execute before first paint
 * so mobile browsers apply scaled viewport (matches hanafidelity.com).
 */
export function ggViewportBootstrapScript(layoutWidth = GG_LAYOUT_WIDTH): string {
  return `(function () {
  var layoutWidth = ${layoutWidth};
  var root = document.documentElement;
  root.classList.remove("dark");
  root.style.colorScheme = "light";
  root.classList.add("gg-public-root", "gg-desktop-lock", "gg-desktop-boot");
  root.style.setProperty("--gg-desktop-lock-width", layoutWidth + "px");

  function readDeviceWidth() {
    if (window.screen && window.screen.width > 0) {
      return window.screen.width;
    }
    if (window.visualViewport && window.visualViewport.width > 0) {
      return window.visualViewport.width;
    }
    if (window.innerWidth > 0) {
      return window.innerWidth;
    }
    return layoutWidth;
  }

  function computeScale(deviceWidth) {
    var scale = layoutWidth > 0 ? deviceWidth / layoutWidth : 1;
    if (scale > 1) scale = 1;
    return Math.round(scale * 10000) / 10000;
  }

  function viewportContent(scale) {
    return (
      "width=" + layoutWidth +
      ", initial-scale=" + scale +
      ", minimum-scale=" + scale +
      ", maximum-scale=5" +
      ", user-scalable=yes" +
      ", viewport-fit=cover"
    );
  }

  document.querySelectorAll('meta[name="viewport"]').forEach(function (m) {
    if (!m.getAttribute("data-gg-fit")) m.remove();
  });

  var meta = document.querySelector('meta[name="viewport"][data-gg-fit]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    meta.setAttribute("data-gg-fit", "1");
    meta.setAttribute("data-layout-width", String(layoutWidth));
    document.head.appendChild(meta);
  }

  meta.content = viewportContent(computeScale(readDeviceWidth()));

  function markBody() {
    if (document.body) {
      document.body.classList.add("gg-public", "gg-desktop-lock");
    }
  }
  markBody();
  document.addEventListener("DOMContentLoaded", markBody, { once: true });
})();`;
}
