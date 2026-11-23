import { useState } from 'react';

import DayPicker from '../date-navigation/day-picker';
import DateToolbar from '../date-navigation/date-toolbar';
import { addDays, MIN_DATE } from '@/lib/dates';
import { getDailySummary } from '@/lib/daily-summary';
import { calendarPlans, categories, dailyPlan, tasks } from '@/lib/mock';
import type { DailyPlan, Task, TaskBlock } from '@/lib/types';

import type { BlockDraft } from './add-block-dialog';
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
  const [addedBlocks, setAddedBlocks] = useState<
    Array<{ task: Task; block: TaskBlock }>
  >([]);

  const initialPlan: DailyPlan = (dailyPlan.date === selectedDate
    ? dailyPlan
    : undefined) ??
    calendarPlans.find((plan) => plan.date === selectedDate) ?? {
      date: selectedDate,
      targetMinutes: 480,
      blocks: [],
    };

  const dayAdditions = addedBlocks.filter(
    ({ block }) => block.date === selectedDate,
  );

  const plan = {
    ...initialPlan,
    blocks: [...initialPlan.blocks, ...dayAdditions.map(({ block }) => block)],
  };

  const dayTasks = [...tasks, ...dayAdditions.map(({ task }) => task)];
  const summary = getDailySummary(plan, dayTasks, categories);

  function addBlock({
    title,
    categoryId,
    startTime,
    durationMinutes,
    notes,
  }: BlockDraft) {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      categoryId,
      notes,
      status: 'todo',
      estimatedMinutes: durationMinutes,
      createdAt: new Date().toISOString(),
    };
    const block: TaskBlock = {
      id: crypto.randomUUID(),
      taskId: task.id,
      date: selectedDate,
      startTime,
      durationMinutes,
      type: 'task',
      status: 'planned',
      actualMinutes: 0,
    };

    setAddedBlocks((current) => [...current, { task, block }]);
  }

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
        tasks={dayTasks}
        categories={categories}
        summary={summary}
        onAddBlock={addBlock}
      />
    </>
  );
}
