import type { Viewport } from "next";
import { GG_LAYOUT_WIDTH } from "@/lib/public/gg-layout-width";

const DEFAULT_MOBILE_CSS_WIDTH = 390;

function deviceWidthFromCookie(cookieHeader: string | null): number | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)gg-vw=(\d+)/);
  if (!match) return null;
  const parsed = parseInt(match[1]!, 10);
  if (Number.isFinite(parsed) && parsed > 0 && parsed < 2400) {
    return parsed;
  }
  return null;
}

export function estimateDeviceCssWidth(
  userAgent: string,
  viewportWidthClientHint: string | null,
  cookieHeader?: string | null,
): number {
  const fromCookie = deviceWidthFromCookie(cookieHeader ?? null);
  if (fromCookie) return fromCookie;

  if (viewportWidthClientHint) {
    const parsed = parseInt(viewportWidthClientHint, 10);
    if (Number.isFinite(parsed) && parsed > 0 && parsed < 2400) {
      return parsed;
    }
  }

  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    return 768;
  }
  if (/iphone|ipod|android|mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    return DEFAULT_MOBILE_CSS_WIDTH;
  }

  return GG_LAYOUT_WIDTH;
}

export function computeMarketingInitialScale(deviceWidth: number): number {
  const scale =
    GG_LAYOUT_WIDTH > 0 ? deviceWidth / GG_LAYOUT_WIDTH : 1;
  const clamped = Math.min(1, scale);
  return Math.round(clamped * 10000) / 10000;
}

export function marketingViewportFromDeviceWidth(deviceWidth: number): Viewport {
  const initialScale = computeMarketingInitialScale(deviceWidth);
  return {
    width: GG_LAYOUT_WIDTH,
    initialScale,
    minimumScale: initialScale,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  };
}

export function resolveMarketingViewport(headerList: Headers): Viewport {
  const ua = headerList.get("user-agent") ?? "";
  const vw =
    headerList.get("sec-ch-viewport-width") ??
    headerList.get("Sec-CH-Viewport-Width");
  const cookie = headerList.get("cookie");
  const deviceWidth = estimateDeviceCssWidth(ua, vw, cookie);
  return marketingViewportFromDeviceWidth(deviceWidth);
}

export const defaultAppViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
