import { GG_LAYOUT_WIDTH } from "@/lib/public/gg-layout-width";

/**
 * Runs synchronously in <head> on marketing pages — before first paint.
 * Does NOT mark layout ready; gg-desktop-viewport-fit.js locks scale on real devices.
 */
export function ggViewportBootstrapScript(layoutWidth = GG_LAYOUT_WIDTH): string {
  return `(function () {
  var layoutWidth = ${layoutWidth};
  var root = document.documentElement;
  root.classList.remove("dark");
  root.style.colorScheme = "light";
  root.classList.add("gg-public-root", "gg-desktop-lock", "gg-desktop-boot");
  root.style.setProperty("--gg-desktop-lock-width", layoutWidth + "px");

  function isMobileUa() {
    var ua = navigator.userAgent || "";
    return /iphone|ipod|ipad|android|mobile|webos|blackberry|iemobile|opera mini/i.test(ua);
  }

  function readDeviceWidthFromCookie() {
    try {
      var m = document.cookie.match(/(?:^|;\\s*)gg-vw=(\\d+)/);
      if (!m) return 0;
      var w = parseInt(m[1], 10);
      if (w <= 0 || w >= 2400) return 0;
      if (isMobileUa() && w > 820) return 0;
      return w;
    } catch (e) {}
    return 0;
  }

  /** Stable width on real phones — visualViewport/innerWidth jump when the URL bar moves. */
  function readStableDeviceWidth() {
    var fromCookie = readDeviceWidthFromCookie();
    if (fromCookie > 0) return fromCookie;
    if (window.screen && window.screen.width > 0) {
      var sw = window.screen.width;
      var sh = window.screen.height || sw;
      return Math.min(sw, sh);
    }
    if (window.innerWidth > 0) return window.innerWidth;
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

  function persistDeviceWidth(w) {
    try {
      document.cookie =
        "gg-vw=" + Math.round(w) + "; path=/; max-age=604800; samesite=lax";
    } catch (e) {}
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

  var deviceWidth = readStableDeviceWidth();
  persistDeviceWidth(deviceWidth);
  meta.content = viewportContent(computeScale(deviceWidth));
  meta.setAttribute("data-gg-scale-locked", "0");

  function markBody() {
    if (document.body) {
      document.body.classList.add("gg-desktop-lock", "gg-public");
    }
  }
  markBody();
  document.addEventListener("DOMContentLoaded", markBody, { once: true });
})();`;
}
