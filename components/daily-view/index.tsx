import DateToolbar from '@/components/date-toolbar';
import { formatDate, getDateKey } from '@/lib/dates';
import { getDailySummary } from '@/lib/daily-summary';
import { categories, dailyPlan, tasks } from '@/lib/mock';

import DailyContent from './daily-content';
import DayStats from './day-stats';
import WeekBar from './week-bar';

export default function DailyView() {
  const selectedDate = dailyPlan.date;
  const today = getDateKey(new Date());
  const summary = getDailySummary(dailyPlan, tasks, categories);

  return (
    <>
      <DateToolbar
        dateTime={selectedDate}
        label={formatDate(selectedDate)}
        period='day'
      />

      <WeekBar selectedDate={selectedDate} today={today} />
      <DayStats summary={summary} />
      <DailyContent
        plan={dailyPlan}
        tasks={tasks}
        categories={categories}
        summary={summary}
      />
    </>
  );
}
