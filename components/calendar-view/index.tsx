'use client';

import { getDailySummary } from '@/lib/daily-summary';
import { calendarPlans } from '@/lib/mock';
import { useState } from 'react';
import MonthStats from './month-stats';

export default function CalendarView() {
  const [month] = useState('2026-11');

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

  return (
    <>
      <MonthStats
        completedMinutes={completedMinutes}
        daysPlanned={daysPlanned}
        goalsMet={goalsMet}
      />
    </>
  );
}
