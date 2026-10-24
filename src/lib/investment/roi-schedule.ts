/** Next payout time — mirrors Zenith HomePageController::automaticRoi intervals. */
export function nextGrowthAfter(
  lastGrowth: Date,
  incrementInterval: string,
): Date {
  const d = new Date(lastGrowth.getTime());
  switch (incrementInterval) {
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
      d.setMinutes(d.getMinutes() + 7);
      return d;
  }
}

export function initialLastGrowth(incrementInterval: string, from = new Date()): Date {
  return nextGrowthAfter(from, incrementInterval);
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
