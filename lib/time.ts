const QUARTER_FRACTIONS: Record<number, string> = {
  15: '¼',
  30: '½',
  45: '¾',
};

export function formatDuration(minutes: number, includeUnit = true): string {
  const totalMinutes = Math.round(minutes);
  if (totalMinutes <= 0) return includeUnit ? '0h' : '0';

  const hours = Math.floor(totalMinutes / 60);
  const remainder = totalMinutes % 60;
  const suffix = includeUnit ? 'h' : '';
  const fraction = QUARTER_FRACTIONS[remainder] ?? '';

  if (hours === 0 && fraction) return `${fraction}${suffix}`;

  if (hours > 0) return `${hours}${fraction}${suffix}`;

  return `${remainder}m`; // Fallback only if non-15m data ever enters the database
}

/** Format an end time in the planner's clock, including any day rollover. */
export function getEndTime(startTime: string, durationMinutes: number) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const daysLater = Math.floor(totalMinutes / (24 * 60));
  const clockMinutes = totalMinutes % (24 * 60);
  const time = `${String(Math.floor(clockMinutes / 60)).padStart(2, '0')}:${String(
    clockMinutes % 60,
  ).padStart(2, '0')}`;

  return daysLater > 0
    ? `${time} (+${daysLater} ${daysLater === 1 ? 'day' : 'days'})`
    : time;
}
