import { formatMonth, getMonthDays, WEEKDAY_LABELS } from '@/lib/dates';
import type { DailyPlan } from '@/lib/types';
import { cn } from '@/lib/utils';
import CalendarDay from './calendar-day';

type CalendarPanelProps = {
  month: string;
  plans: DailyPlan[];
  today: string;
  lastOpenedDay: string | undefined;
  minDate: string;
  onSelectDate: (date: string) => void;
};

export default function CalendarPanel({
  month,
  plans,
  today,
  lastOpenedDay,
  minDate,
  onSelectDate,
}: CalendarPanelProps) {
  const days = getMonthDays(month);
  const plansByDate = new Map(plans.map((plan) => [plan.date, plan]));

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
        {days.map((date, index) => (
          <CalendarDay
            key={date}
            date={date}
            plan={date >= minDate ? plansByDate.get(date) : undefined}
            outsideMonth={!date.startsWith(month)}
            isToday={date === today}
            isLastOpened={
              date === lastOpenedDay && date.startsWith(`${month}-`)
            }
            disabled={date < minDate}
            className={cn(
              index % 7 !== 6 && 'border-r',
              index < days.length - 7 && 'border-b',
            )}
            onSelect={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
}
