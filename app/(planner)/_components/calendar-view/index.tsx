import DateToolbar from '../date-navigation/date-toolbar';
import MonthPicker from '../date-navigation/month-picker';
import { Button } from '@/components/ui/button';
import { MIN_DATE, parseDateKey } from '@/lib/dates';
import type { PlanSummaryByMonth } from '@/lib/types';
import MonthStats from './month-stats';
import CalendarPanel from './calendar-panel';
import CalendarLegend from './calendar-legend';

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
            completedMinutes={summary.completedMinutes}
            daysPlanned={summary.daysPlanned}
            goalsMet={summary.goalsMet}
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
