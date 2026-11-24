import { useState } from 'react';

import DayPicker from '../date-navigation/day-picker';
import DateToolbar from '../date-navigation/date-toolbar';
import { addDays, MIN_DATE } from '@/lib/dates';
import { getDailySummary } from '@/lib/daily-summary';
import { Button } from '@/components/ui/button';
import type { DailyPlanSnapshot, ScheduleBlock, TaskBlock } from '@/lib/types';
import { usePlannerDefaults } from '../planner-defaults-provider';

import type { BlockDraft } from './add-block-dialog';
import DailyContent from './daily-content';
import DayStats from './day-stats';
import WeekBar from './week-bar';

export default function DailyView({
  selectedDate,
  today,
  onSelectDate,
  onRetry,
  schedule,
  scheduleError,
}: {
  selectedDate: string;
  today: string;
  schedule: { plan: DailyPlanSnapshot; blocks: ScheduleBlock[] } | undefined;
  scheduleError: string | undefined;
  onRetry: () => void;
  onSelectDate: (date: string) => void;
}) {
  const [addedBlocks, setAddedBlocks] = useState<TaskBlock[]>([]);

  const { error: defaultsError, ...result } = usePlannerDefaults();
  const defaults = 'data' in result ? result.data : undefined;
  const savedPlan = schedule?.plan;
  const loadError = scheduleError ?? (savedPlan ? undefined : defaultsError);
  const needsSetup = !loadError && !savedPlan && !defaults;
  const categories = savedPlan?.categories ?? defaults?.categories ?? [];
  const categoryIds = new Set(categories.map(({ id }) => id));
  const plan = {
    date: selectedDate,
    targetMinutes: savedPlan?.targetMinutes ?? defaults?.targetMinutes,
    blocks: [
      ...(schedule?.blocks ?? []),
      ...addedBlocks.filter(
        (block) =>
          block.date === selectedDate && categoryIds.has(block.categoryId),
      ),
    ],
  };
  const summary = getDailySummary(plan, categories);

  function addBlock({
    title,
    categoryId,
    startTime,
    durationMinutes,
    notes,
  }: BlockDraft) {
    const block: TaskBlock = {
      id: crypto.randomUUID(),
      categoryId,
      title,
      notes,
      date: selectedDate,
      startTime,
      durationMinutes,
      type: 'task',
      status: 'planned',
      actualMinutes: 0,
    };

    setAddedBlocks((current) => [...current, block]);
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

      {loadError ? (
        <div className='space-y-2'>
          <p role='status' className='text-destructive text-sm'>
            {loadError}
          </p>

          <Button variant='outline' onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          <DayStats summary={summary} />

          <DailyContent
            plan={plan}
            categories={categories}
            summary={summary}
            needsSetup={needsSetup}
            timezone={savedPlan?.timezone ?? defaults?.timezone}
            onAddBlock={addBlock}
          />
        </>
      )}
    </>
  );
}
