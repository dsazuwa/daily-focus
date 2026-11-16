export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return (
    [hours > 0 ? `${hours}h` : '', remainder > 0 ? `${remainder}m` : '']
      .filter(Boolean)
      .join(' ') || '0m'
  );
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
