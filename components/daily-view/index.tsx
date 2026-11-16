import { getDateKey } from '@/lib/dates';
import { getDailySummary } from '@/lib/daily-summary';
import { categories, dailyPlan, tasks } from '@/lib/mock';

import DailyContent from './daily-content';
import DayBar from './day-bar';
import ProgressCard from './progress-card';
import WeekBar from './week-bar';

export default function DailyView() {
  const selectedDate = dailyPlan.date;
  const today = getDateKey(new Date());
  const summary = getDailySummary(dailyPlan, tasks, categories);

  return (
    <>
      <DayBar selectedDate={selectedDate} />
      <WeekBar selectedDate={selectedDate} today={today} />
      <ProgressCard summary={summary} />
      <DailyContent
        plan={dailyPlan}
        tasks={tasks}
        categories={categories}
        summary={summary}
      />
    </>
  );
}
