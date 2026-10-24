"use server";

import { refreshAssetPrices } from "@/lib/trading/assets";

export async function refreshAssetPricesAction() {
  return refreshAssetPrices();
}
