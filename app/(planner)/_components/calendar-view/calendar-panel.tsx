import { formatMonth, getMonthDays, WEEKDAY_LABELS } from '@/lib/dates';
import type { CalendarDaySummary } from '@/lib/types';
import { cn } from '@/lib/utils';
import CalendarDay from './calendar-day';

type CalendarPanelProps = {
  today: string;
  month: string;
  daySummaries: CalendarDaySummary[];
  lastOpenedDay: string | undefined;
  minDate: string;
  onSelectDate: (date: string) => void;
};

export default function CalendarPanel({
  today,
  month,
  daySummaries,
  lastOpenedDay,
  minDate,
  onSelectDate,
}: CalendarPanelProps) {
  const dates = getMonthDays(month);
  const summariesByDate = new Map(daySummaries.map((day) => [day.date, day]));

  return (
    <div
      aria-label={`${formatMonth(month)} calendar`}
      className='bg-card overflow-hidden border'
    >
      <div
        className='bg-primary/10 grid grid-cols-7 border-b'
        aria-hidden='true'
      >
        {WEEKDAY_LABELS.map((day) => (
          <span
            key={day}
            className='text-muted-foreground py-3 text-center text-xs font-medium'
          >
            {day}
          </span>
        ))}
      </div>

      <div
        className='grid grid-cols-7'
        aria-label={`${formatMonth(month)} days`}
      >
        {dates.map((date, index) => (
          <CalendarDay
            key={date}
            date={date}
            summary={summariesByDate.get(date)}
            outsideMonth={!date.startsWith(month)}
            isToday={date === today}
            isLastOpened={
              date === lastOpenedDay && date.startsWith(`${month}-`)
            }
            disabled={date < minDate}
            className={cn(
              index % 7 !== 6 && 'border-r',
              index < dates.length - 7 && 'border-b',
            )}
            onSelect={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
}
