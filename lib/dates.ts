export const BROWSER_TIME_ZONE_COOKIE = 'planner_browser_timezone';
export const PLANNER_LOCALE = 'en-GB';
export const WEEK_START = 1; // Monday, using JavaScript weekday numbering.
export const MIN_DATE = '0001-01-01';

export function isValidTimeZone(
  timeZone: string | undefined,
): timeZone is string {
  if (!timeZone) return false;

  try {
    new Intl.DateTimeFormat('en-GB', { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Convert an instant to a date key in the planner's timezone. */
export function getDateKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const part = (type: string) =>
    parts.find((value) => value.type === type)!.value;

  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** UTC is used only as a calendar arithmetic carrier, not a planner instant. */
export function parseDateKey(key: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || key < MIN_DATE)
    throw new RangeError(`Invalid date key: ${key}`);

  const date = new Date(`${key}T00:00:00Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== key)
    throw new RangeError(`Invalid date key: ${key}`);

  return date;
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  try {
    parseDateKey(value);
    return true;
  } catch {
    return false;
  }
}

export function isMonthKey(value: unknown): value is string {
  return typeof value === 'string' && isDateKey(`${value}-01`);
}

export function addDays(key: string, amount: number): string {
  const date = parseDateKey(key);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

export function formatDate(
  key: string,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_FORMAT,
): string {
  return new Intl.DateTimeFormat(PLANNER_LOCALE, {
    ...options,
    timeZone: 'UTC',
  }).format(parseDateKey(key));
}

export function formatMonth(month: string): string {
  return formatDate(`${month}-01`, { month: 'long', year: 'numeric' });
}

export function getWeekDays(selectedDate: string, today: string) {
  const offset = (parseDateKey(selectedDate).getUTCDay() - WEEK_START + 7) % 7;

  return Array.from({ length: 7 }, (_, index) =>
    addDays(selectedDate, index - offset),
  )
    .filter((date) => isSupportedDateKey(date))
    .map((dateKey) => ({
      dateKey,
      dayName: formatDate(dateKey, { weekday: 'short' }),
      dayNumber: parseDateKey(dateKey).getUTCDate(),
      isSelected: dateKey === selectedDate,
      isToday: dateKey === today,
    }));
}

export function getMonthDays(month: string): string[] {
  const firstDay = `${month}-01`;
  const firstDate = parseDateKey(firstDay);
  const nextMonth = new Date(firstDate);

  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
  nextMonth.setUTCDate(0);

  const offset = (firstDate.getUTCDay() - WEEK_START + 7) % 7;
  const cellCount = Math.ceil((offset + nextMonth.getUTCDate()) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) =>
    addDays(firstDay, index - offset),
  ).filter((date) => isSupportedDateKey(date));
}

function isSupportedDateKey(date: string) {
  return /^\d{4}-/.test(date) && date >= MIN_DATE;
}

export const WEEKDAY_LABELS = getWeekDays('2026-11-16', '2026-11-16').map(
  (day) => day.dayName,
);
