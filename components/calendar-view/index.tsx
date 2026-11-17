'use client';

import { useState } from 'react';

import DateToolbar from '@/components/date-toolbar';
import { getDailySummary } from '@/lib/daily-summary';
import { formatMonth, getDateKey } from '@/lib/dates';
import { calendarPlans } from '@/lib/mock';
import MonthStats from './month-stats';

export default function CalendarView() {
  const [today] = useState(() => getDateKey(new Date()));
  const [month, setMonth] = useState('2026-11');

  const summaries = calendarPlans
    .filter((plan) => plan.date.startsWith(`${month}-`))
    .map((plan) => getDailySummary(plan, [], []));

  const completedMinutes = summaries.reduce(
    (total, summary) => total + summary.completedMinutes,
    0,
  );

  const daysPlanned = summaries.filter(
    (summary) => summary.plannedMinutes > 0,
  ).length;

  const goalsMet = summaries.filter(
    (summary) => summary.completedMinutes >= 480,
  ).length;

  const changeMonth = (offset: number) => {
    setMonth((currentMonth) => {
      const date = new Date(`${currentMonth}-01T00:00:00Z`);
      date.setUTCMonth(date.getUTCMonth() + offset);
      return date.toISOString().slice(0, 7);
    });
  };

  return (
    <>
      <DateToolbar
        dateTime={month}
        label={formatMonth(month)}
        period='month'
        onPrevious={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
        onReset={() => setMonth(today.slice(0, 7))}
      />

      <MonthStats
        completedMinutes={completedMinutes}
        daysPlanned={daysPlanned}
        goalsMet={goalsMet}
      />
    </>
  );
}
