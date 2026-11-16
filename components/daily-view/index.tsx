import { categories, dailyPlan, tasks } from '@/lib/mock';

import DailyContent from './daily-content';
import DayBar from './day-bar';
import ProgressCard from './progress-card';
import WeekBar from './week-bar';

export default function DailyView() {
  const [year, month, day] = dailyPlan.date.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const today = new Date();

  return (
    <>
      <DayBar selectedDate={selectedDate} />
      <WeekBar selectedDate={selectedDate} today={today} />
      <ProgressCard plan={dailyPlan} />
      <DailyContent plan={dailyPlan} tasks={tasks} categories={categories} />
    </>
  );
}
