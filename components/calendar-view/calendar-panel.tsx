import { useState } from 'react';

import { formatMonth, getMonthDays, WEEKDAY_LABELS } from '@/lib/dates';
import type { DailyPlan } from '@/lib/types';
import { cn } from '@/lib/utils';
import CalendarDay from './calendar-day';

type CalendarPanelProps = {
  month: string;
  plans: DailyPlan[];
  today: string;
  initialSelectedDate?: string;
  onSelectDate?: (date: string) => void;
  isLoading?: boolean;
};

export default function CalendarPanel({
  month,
  plans,
  today,
  initialSelectedDate = today,
  onSelectDate,
  isLoading = false,
}: CalendarPanelProps) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const days = getMonthDays(month);
  const plansByDate = new Map(plans.map((plan) => [plan.date, plan]));

  return (
    <section
      aria-label={`${formatMonth(month)} calendar`}
      aria-busy={isLoading}
      className='bg-card overflow-hidden border'
    >
      <div className='bg-primary/10 grid grid-cols-7 border-b' aria-hidden='true'>
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
            plan={plansByDate.get(date)}
            outsideMonth={!date.startsWith(month)}
            isToday={date === today}
            isSelected={date === selectedDate}
            className={cn(
              index % 7 !== 6 && 'border-r',
              index < days.length - 7 && 'border-b',
            )}
            onSelect={(date) => {
              setSelectedDate(date);
              onSelectDate?.(date);
            }}
          />
        ))}
      </div>
    </section>
  );
}
