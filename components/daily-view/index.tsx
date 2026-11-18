'use client';

import { useState } from 'react';
import DayPicker from '@/components/date-navigation/day-picker';
import DateToolbar from '@/components/date-navigation/date-toolbar';
import {
  addDays,
  clampDate,
  DEFAULT_START_DATE,
  getDateKey,
} from '@/lib/dates';
import { getDailySummary } from '@/lib/daily-summary';
import { calendarPlans, categories, dailyPlan, tasks } from '@/lib/mock';
import type { DailyPlan } from '@/lib/types';

import DailyContent from './daily-content';
import DayStats from './day-stats';
import WeekBar from './week-bar';

export default function DailyView({
  selectedDate: initialSelectedDate = dailyPlan.date,
  today = getDateKey(new Date()),
  startDate = DEFAULT_START_DATE,
}: {
  selectedDate?: string;
  today?: string;
  startDate?: string;
} = {}) {
  const [date, setDate] = useState(initialSelectedDate);
  const selectedDate = clampDate(date, startDate);
  const selectDate = (date: string) => setDate(clampDate(date, startDate));
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
        previousDisabled={selectedDate <= startDate}
        onPrevious={() => selectDate(addDays(selectedDate, -1))}
        onNext={() => selectDate(addDays(selectedDate, 1))}
        onReset={() => selectDate(today)}
      >
        <DayPicker
          selectedDate={selectedDate}
          today={today}
          onSelect={selectDate}
          minDate={startDate}
        />
      </DateToolbar>

      <WeekBar
        selectedDate={selectedDate}
        today={today}
        onSelectDate={selectDate}
        minDate={startDate}
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
