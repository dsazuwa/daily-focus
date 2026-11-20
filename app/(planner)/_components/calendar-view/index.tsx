import DateToolbar from '../date-navigation/date-toolbar';
import MonthPicker from '../date-navigation/month-picker';
import { getDailySummary } from '@/lib/daily-summary';
import { MIN_DATE, parseDateKey } from '@/lib/dates';
import { calendarPlans } from '@/lib/mock';
import MonthStats from './month-stats';
import CalendarPanel from './calendar-panel';
import CalendarLegend from './calendar-legend';

export default function CalendarView({
  month,
  today,
  onSelectMonth,
  onSelectDate,
}: {
  month: string;
  today: string;
  onSelectMonth: (month: string) => void;
  onSelectDate: (date: string) => void;
}) {
  const summaries = calendarPlans
    .filter(
      (plan) => plan.date >= MIN_DATE && plan.date.startsWith(`${month}-`),
    )
    .map((plan) => getDailySummary(plan, [], []));

  const completedMinutes = summaries.reduce(
    (total, summary) => total + summary.completedMinutes,
    0,
  );

  const daysPlanned = summaries.filter(
    (summary) => summary.plannedMinutes > 0,
  ).length;

  const goalsMet = summaries.filter(
    (summary) => summary.completedMinutes >= summary.targetMinutes,
  ).length;

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

      <MonthStats
        completedMinutes={completedMinutes}
        daysPlanned={daysPlanned}
        goalsMet={goalsMet}
      />

      <CalendarLegend />

      <CalendarPanel
        month={month}
        plans={calendarPlans}
        today={today}
        minDate={MIN_DATE}
        onSelectDate={onSelectDate}
      />
    </>
  );
}
