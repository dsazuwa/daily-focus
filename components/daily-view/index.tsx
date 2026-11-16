import DailyContent from './daily-content';
import DayBar from './day-bar';
import ProgressCard from './progress-card';
import WeekBar from './week-bar';

export default function DailyView() {
  return (
    <>
      <DayBar />
      <WeekBar />
      <ProgressCard />
      <DailyContent />
    </>
  );
}
