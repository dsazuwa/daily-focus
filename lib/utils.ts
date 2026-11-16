export { cn } from 'cn';

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return (
    [hours > 0 ? `${hours}h` : '', remainder > 0 ? `${remainder}m` : '']
      .filter(Boolean)
      .join(' ') || '0m'
  );
}

export function getEndTime(startTime: string, durationMinutes: number) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const total = hours * 60 + minutes + durationMinutes;

  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
    total % 60,
  ).padStart(2, '0')}`;
}
