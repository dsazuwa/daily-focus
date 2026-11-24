import Check from 'lucide-react/icons/check';

import { Button } from '@/components/ui/button';
import { MIN_DATE, parseDateKey } from '@/lib/dates';
import type { PlanSummaryByMonth } from '@/lib/types';
import DateToolbar from '../date-navigation/date-toolbar';
import MonthPicker from '../date-navigation/month-picker';
import CalendarPanel from './calendar-panel';
import MonthStats from './month-stats';

export default function CalendarView({
  month,
  today,
  lastOpenedDay,
  summary,
  onSelectMonth,
  onSelectDate,
  onRetry,
}: {
  month: string;
  today: string;
  lastOpenedDay: string | undefined;
  summary: PlanSummaryByMonth | undefined;
  onSelectMonth: (month: string) => void;
  onSelectDate: (date: string) => void;
  onRetry: () => void;
}) {
  const changeMonth = (offset: number) => {
    const date = parseDateKey(`${month}-01`);
    date.setUTCMonth(date.getUTCMonth() + offset);
    onSelectMonth(date.toISOString().slice(0, 7));
  };

  return (
    <>
      <DateToolbar
        period='month'
        previousDisabled={month === MIN_DATE.slice(0, 7)}
        onPrevious={() => changeMonth(-1)}
        nextDisabled={month === '9999-12'}
        onNext={() => changeMonth(1)}
        onReset={() => onSelectMonth(today.slice(0, 7))}
        resetDisabled={month === today.slice(0, 7)}
      >
        <MonthPicker
          month={month}
          onSelect={onSelectMonth}
          minDate={MIN_DATE}
        />
      </DateToolbar>

      {summary ? (
        <>
          <MonthStats
            plannedMinutes={summary.plannedMinutes}
            daysPlanned={summary.daysPlanned}
            targetsPlanned={summary.targetsPlanned}
          />

          <CalendarLegend />

          <CalendarPanel
            month={month}
            daySummaries={summary.daySummaries}
            today={today}
            lastOpenedDay={lastOpenedDay}
            minDate={MIN_DATE}
            onSelectDate={onSelectDate}
          />
        </>
      ) : (
        <div className='flex items-center gap-3'>
          <p role='alert' className='text-destructive'>
            Unable to load the selected month.
          </p>

          <Button type='button' variant='outline' size='sm' onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </>
  );
}

function CalendarLegend() {
  return (
    <div className='text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-xs'>
      <span className='inline-flex items-center gap-2'>
        <span
          className='bg-primary size-1.5 shrink-0 rounded-full'
          aria-hidden='true'
        />
        Planned day
      </span>

      <span className='inline-flex items-center gap-2'>
        <Check className='text-primary size-3 shrink-0' aria-hidden='true' />
        Daily target planned
      </span>

      <span className='w-full sm:ml-auto sm:w-auto' role='status'>
        Select a date to open its plan.
      </span>
    </div>
  );
}
