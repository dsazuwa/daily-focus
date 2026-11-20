'use client';

import { useState } from 'react';

import DateToolbar from '@/components/date-navigation/date-toolbar';
import MonthPicker from '@/components/date-navigation/month-picker';
import { getDailySummary } from '@/lib/daily-summary';
import { clampDate, DEFAULT_START_DATE, getDateKey } from '@/lib/dates';
import { calendarPlans } from '@/lib/mock';
import MonthStats from './month-stats';
import CalendarPanel from './calendar-panel';
import CalendarLegend from './calendar-legend';

export default function CalendarView({
  startDate = DEFAULT_START_DATE,
}: {
  startDate?: string;
}) {
  const [today] = useState(() => getDateKey(new Date()));
  const minMonth = startDate.slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7));
  const month = clampDate(selectedMonth, minMonth);
  const selectMonth = (month: string) =>
    setSelectedMonth(clampDate(month, minMonth));

  const summaries = calendarPlans
    .filter(
      (plan) => plan.date >= startDate && plan.date.startsWith(`${month}-`),
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
    const date = new Date(`${month}-01T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + offset);
    selectMonth(date.toISOString().slice(0, 7));
  };

  return (
    <>
      <DateToolbar
        period='month'
        previousDisabled={month <= minMonth}
        onPrevious={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
        onReset={() => selectMonth(today.slice(0, 7))}
      >
        <MonthPicker month={month} onSelect={selectMonth} minDate={startDate} />
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
        minDate={startDate}
      />
    </>
  );
}
