/** Canonical Zenith interval labels stored in DB. */
export const ROI_INTERVALS = [
  "Monthly",
  "Weekly",
  "Daily",
  "Hourly",
  "Every 30 Minutes",
] as const;

export type RoiInterval = (typeof ROI_INTERVALS)[number];

/** How long to wait after lastGrowth before the next ROI drop. */
export type RoiSchedule =
  | { kind: "canonical"; interval: RoiInterval }
  | { kind: "days"; days: number }
  | { kind: "hours"; hours: number }
  | { kind: "minutes"; minutes: number };

const INTERVAL_ALIASES: Record<string, RoiInterval> = {
  monthly: "Monthly",
  month: "Monthly",
  "1 month": "Monthly",
  week: "Weekly",
  weekly: "Weekly",
  "1 week": "Weekly",
  daily: "Daily",
  day: "Daily",
  "1 day": "Daily",
  hourly: "Hourly",
  hour: "Hourly",
  "1 hour": "Hourly",
  "every 30 minutes": "Every 30 Minutes",
  "30 minutes": "Every 30 Minutes",
  "30 min": "Every 30 Minutes",
  "every 30 min": "Every 30 Minutes",
};

function collapseWhitespace(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/**
 * Parse plan `incrementInterval` from DB (any casing / wording) into a payout schedule.
 * Each plan keeps its own timing — Daily ≠ Weekly ≠ Monthly.
 */
export function resolveRoiSchedule(raw: string): RoiSchedule {
  const trimmed = collapseWhitespace(raw);
  if (!trimmed) {
    return { kind: "canonical", interval: "Monthly" };
  }

  if ((ROI_INTERVALS as readonly string[]).includes(trimmed)) {
    return { kind: "canonical", interval: trimmed as RoiInterval };
  }

  const key = trimmed.toLowerCase();
  const alias = INTERVAL_ALIASES[key];
  if (alias) {
    return { kind: "canonical", interval: alias };
  }

  const dayMatch = key.match(/^(\d+)\s*days?$/);
  if (dayMatch) {
    const days = Math.max(1, parseInt(dayMatch[1]!, 10));
    if (days === 1) {
      return { kind: "canonical", interval: "Daily" };
    }
    if (days >= 25) {
      return { kind: "canonical", interval: "Monthly" };
    }
    if (days >= 5 && days <= 8) {
      return { kind: "days", days };
    }
    return { kind: "days", days };
  }

  const weekMatch = key.match(/^(\d+)\s*weeks?$/);
  if (weekMatch) {
    const weeks = Math.max(1, parseInt(weekMatch[1]!, 10));
    return { kind: "days", days: weeks * 7 };
  }

  const monthMatch = key.match(/^(\d+)\s*months?$/);
  if (monthMatch) {
    const months = Math.max(1, parseInt(monthMatch[1]!, 10));
    return { kind: "days", days: months * 27 };
  }

  const hourMatch = key.match(/^(\d+)\s*hours?$/);
  if (hourMatch) {
    const hours = Math.max(1, parseInt(hourMatch[1]!, 10));
    if (hours === 1) {
      return { kind: "canonical", interval: "Hourly" };
    }
    return { kind: "hours", hours };
  }

  const minMatch = key.match(/^(\d+)\s*(?:minutes?|mins?)$/);
  if (minMatch) {
    const minutes = Math.max(1, parseInt(minMatch[1]!, 10));
    if (minutes <= 30) {
      return { kind: "canonical", interval: "Every 30 Minutes" };
    }
    return { kind: "minutes", minutes };
  }

  if (key.includes("month")) {
    return { kind: "canonical", interval: "Monthly" };
  }
  if (key.includes("week") || key.includes("7 day")) {
    return { kind: "days", days: 7 };
  }
  if (key.includes("day")) {
    return { kind: "canonical", interval: "Daily" };
  }
  if (key.includes("hour")) {
    return { kind: "canonical", interval: "Hourly" };
  }
  if (key.includes("min")) {
    return { kind: "canonical", interval: "Every 30 Minutes" };
  }

  return { kind: "canonical", interval: "Monthly" };
}

/** Nearest canonical label (for grouping / caps). Unknown strings default to Monthly, not Daily. */
export function normalizeIncrementInterval(raw: string): RoiInterval {
  const schedule = resolveRoiSchedule(raw);
  if (schedule.kind === "canonical") {
    return schedule.interval;
  }
  if (schedule.kind === "days") {
    if (schedule.days >= 25) return "Monthly";
    if (schedule.days >= 5) return "Weekly";
    return "Daily";
  }
  if (schedule.kind === "hours") {
    return schedule.hours <= 1 ? "Hourly" : "Hourly";
  }
  return "Every 30 Minutes";
}

/** Human-readable interval for UI (preserves e.g. "7 Days" when stored that way). */
export function formatIncrementInterval(raw: string): string {
  const trimmed = collapseWhitespace(raw);
  if ((ROI_INTERVALS as readonly string[]).includes(trimmed)) {
    return trimmed;
  }
  const schedule = resolveRoiSchedule(raw);
  if (schedule.kind === "canonical") {
    return schedule.interval;
  }
  if (schedule.kind === "days") {
    return schedule.days === 1 ? "Daily" : `${schedule.days} Days`;
  }
  if (schedule.kind === "hours") {
    return schedule.hours === 1 ? "Hourly" : `${schedule.hours} Hours`;
  }
  return `${schedule.minutes} Minutes`;
}

/** Next payout time — mirrors Zenith `HomePageController::automaticRoi` for canonical labels. */
export function nextGrowthAfter(
  lastGrowth: Date,
  incrementInterval: string,
): Date {
  const schedule = resolveRoiSchedule(incrementInterval);
  const d = new Date(lastGrowth.getTime());

  if (schedule.kind === "days") {
    d.setDate(d.getDate() + schedule.days);
    return d;
  }
  if (schedule.kind === "hours") {
    d.setHours(d.getHours() + schedule.hours);
    return d;
  }
  if (schedule.kind === "minutes") {
    d.setMinutes(d.getMinutes() + schedule.minutes);
    return d;
  }

  switch (schedule.interval) {
    case "Monthly":
      d.setDate(d.getDate() + 27);
      return d;
    case "Weekly":
      d.setDate(d.getDate() + 6);
      return d;
    case "Daily":
      d.setHours(d.getHours() + 23);
      return d;
    case "Hourly":
      d.setMinutes(d.getMinutes() + 54);
      return d;
    case "Every 30 Minutes":
      d.setMinutes(d.getMinutes() + 24);
      return d;
    default:
      d.setDate(d.getDate() + 27);
      return d;
  }
}

/** @deprecated Join flow stores activation time as lastGrowth. */
export function initialLastGrowth(incrementInterval: string, from = new Date()): Date {
  return nextGrowthAfter(from, incrementInterval);
}

/**
 * ROI anchor for schedule + cron. One-time fix when join stored lastGrowth as first
 * due date and no ROI has been paid yet (profitEarned === 0).
 */
export function resolvePlanLastGrowth(
  row: {
    lastGrowth: Date | null;
    activatedAt: Date | null;
    createdAt: Date;
    profitEarned?: number;
  },
  incrementInterval: string,
): Date {
  let lastGrowth = row.lastGrowth ?? row.activatedAt ?? row.createdAt;
  const activated = row.activatedAt ?? row.createdAt;

  if (
    (row.profitEarned ?? 0) === 0 &&
    row.lastGrowth &&
    activated
  ) {
    const firstDue = nextGrowthAfter(activated, incrementInterval);
    const delta = Math.abs(row.lastGrowth.getTime() - firstDue.getTime());
    if (delta < 120_000) {
      lastGrowth = activated;
    }
  }

  return lastGrowth;
}

/** Max ROI drops to apply in one cron/sync run (prevents runaway catch-up). */
export function maxCatchupForInterval(incrementInterval: string): number {
  const schedule = resolveRoiSchedule(incrementInterval);

  if (schedule.kind === "minutes") {
    return schedule.minutes <= 30 ? 48 : 24;
  }
  if (schedule.kind === "hours") {
    return schedule.hours <= 1 ? 48 : 24;
  }
  if (schedule.kind === "days") {
    if (schedule.days >= 25) return 3;
    if (schedule.days >= 5) return 8;
    return 14;
  }

  switch (schedule.interval) {
    case "Every 30 Minutes":
      return 48;
    case "Hourly":
      return 48;
    case "Daily":
      return 14;
    case "Weekly":
      return 8;
    case "Monthly":
      return 3;
    default:
      return 3;
  }
}

export function computeIncrement(
  amount: number,
  incrementAmount: string | number,
  incrementType: string,
): number {
  const inc = Number(incrementAmount);
  if (incrementType === "Percentage") {
    return Math.round((amount * inc) / 100);
  }
  return Math.round(inc);
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}
