/** Downsample price series for compact sparklines (keeps first & last). */
export function downsampleSparkline(values: number[], target = 32): number[] {
  const clean = values.filter((v) => Number.isFinite(v) && v > 0);
  if (clean.length === 0) return [];
  if (clean.length <= target) return clean;
  const out: number[] = [];
  for (let i = 0; i < target; i++) {
    const idx = Math.round((i / (target - 1)) * (clean.length - 1));
    out.push(clean[idx]!);
  }
  return out;
}

/** Fallback when upstream omits history (visual hint from 24h % move). */
export function syntheticSparkline(
  price: number,
  changePercent: number,
  points = 28,
): number[] {
  if (!Number.isFinite(price) || price <= 0) return [];
  const end = price;
  const start = price / (1 + changePercent / 100);
  return Array.from({ length: points }, (_, i) => {
    const t = points <= 1 ? 1 : i / (points - 1);
    const wave = Math.sin(i * 0.85) * 0.006 * end;
    return start + (end - start) * t + wave;
  });
}

export function resolveSparkline(
  series: number[] | undefined,
  price: number,
  changePercent: number,
): number[] {
  const sampled = series?.length
    ? downsampleSparkline(series)
    : syntheticSparkline(price, changePercent);
  return sampled.length >= 2
    ? sampled
    : syntheticSparkline(price, changePercent);
}
