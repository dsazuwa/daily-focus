'use client';

import { useState } from 'react';
import DayPicker from '@/components/date-navigation/day-picker';
import DateToolbar from '@/components/date-navigation/date-toolbar';
import { addDays, getDateKey } from '@/lib/dates';
import { getDailySummary } from '@/lib/daily-summary';
import { calendarPlans, categories, dailyPlan, tasks } from '@/lib/mock';
import type { DailyPlan } from '@/lib/types';

import DailyContent from './daily-content';
import DayStats from './day-stats';
import WeekBar from './week-bar';

export default function DailyView({
  selectedDate: initialSelectedDate = dailyPlan.date,
  today = getDateKey(new Date()),
}: {
  selectedDate?: string;
  today?: string;
} = {}) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const plan: DailyPlan = (dailyPlan.date === selectedDate
    ? dailyPlan
    : undefined) ??
    calendarPlans.find((plan) => plan.date === selectedDate) ?? {
      date: selectedDate,
      targetMinutes: 480,
      blocks: [],
    };

  const summary = getDailySummary(plan, tasks, categories);

  return (
    <>
      <DateToolbar
        period='day'
        onPrevious={() => setSelectedDate(addDays(selectedDate, -1))}
        onNext={() => setSelectedDate(addDays(selectedDate, 1))}
        onReset={() => setSelectedDate(today)}
      >
        <DayPicker
          selectedDate={selectedDate}
          today={today}
          onSelect={setSelectedDate}
        />
      </DateToolbar>

      <WeekBar
        selectedDate={selectedDate}
        today={today}
        onSelectDate={setSelectedDate}
      />
      <DayStats summary={summary} />
      <DailyContent
        plan={plan}
        tasks={tasks}
        categories={categories}
        summary={summary}
      />
    </>
  );
}
