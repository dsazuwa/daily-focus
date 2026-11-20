import DayPicker from '../date-navigation/day-picker';
import DateToolbar from '../date-navigation/date-toolbar';
import { addDays, MIN_DATE } from '@/lib/dates';
import { getDailySummary } from '@/lib/daily-summary';
import { calendarPlans, categories, dailyPlan, tasks } from '@/lib/mock';
import type { DailyPlan } from '@/lib/types';

import DailyContent from './daily-content';
import DayStats from './day-stats';
import WeekBar from './week-bar';

export default function DailyView({
  selectedDate,
  today,
  onSelectDate,
}: {
  selectedDate: string;
  today: string;
  onSelectDate: (date: string) => void;
}) {
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
        previousDisabled={selectedDate <= MIN_DATE}
        onPrevious={() => onSelectDate(addDays(selectedDate, -1))}
        nextDisabled={selectedDate === '9999-12-31'}
        onNext={() => onSelectDate(addDays(selectedDate, 1))}
        onReset={() => onSelectDate(today)}
        resetDisabled={selectedDate === today}
      >
        <DayPicker
          selectedDate={selectedDate}
          today={today}
          onSelect={onSelectDate}
          minDate={MIN_DATE}
        />
      </DateToolbar>

      <WeekBar
        selectedDate={selectedDate}
        today={today}
        onSelectDate={onSelectDate}
        minDate={MIN_DATE}
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
