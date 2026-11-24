import Coffee from 'lucide-react/icons/coffee';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { DailySummaryData } from '@/lib/daily-summary';
import { formatDuration, getMinutesSinceMidnight } from '@/lib/time';
import type { DailyPlan, Task, TaskCategory } from '@/lib/types';
import { usePlannerDefaultsDialog } from '../planner-defaults-provider';
import { AddTaskDialog, type TaskDraft } from './add-task-dialog';
import DailySummary from './daily-summary';
import TaskCard from './task-card';

type DailyContentProps = {
  plan: DailyPlan;
  summary: DailySummaryData;
  needsSetup: boolean;
  categories: TaskCategory[];
  timezone?: string;
  onAddTask: (task: TaskDraft) => string | undefined;
};

export default function DailyContent({
  plan,
  categories,
  summary,
  needsSetup,
  timezone,
  onAddTask,
}: DailyContentProps) {
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const sortedTasks = plan.tasks
    .filter((task) => task.date === plan.date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  let scheduledUntil: number | undefined;
  const taskRows: ReactNode[] = [];

  for (const task of sortedTasks) {
    const startMinutes = getMinutesSinceMidnight(task.startTime);

    const gapMinutes =
      scheduledUntil === undefined ? 0 : startMinutes - scheduledUntil;

    const endMinutes = startMinutes + task.durationMinutes;
    scheduledUntil = Math.max(scheduledUntil ?? endMinutes, endMinutes);

    taskRows.push(
      <div key={task.id} className='space-y-3'>
        {gapMinutes > 0 && <BreakRow durationMinutes={gapMinutes} />}

        <ScheduleTaskItem
          task={task}
          timezone={timezone}
          categoryMap={categoryMap}
        />
      </div>,
    );
  }

  return (
    <div className='gap-uniform grid md:grid-cols-12'>
      <div className='space-y-3 md:col-span-7'>
        <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
          <div className='space-y-1'>
            <h2 className='text-section-title'>Your schedule</h2>

            <p className='text-section-description'>
              Breaks don&apos;t count toward your goal
            </p>
          </div>

          {timezone && categories.length > 0 && (
            <AddTaskDialog
              key={plan.date}
              categories={categories}
              timezone={timezone}
              onAddTask={onAddTask}
            />
          )}
        </div>

        {taskRows.length === 0 ? (
          <p className='text-muted-foreground py-8 text-center text-sm'>
            No tasks scheduled for this day.
          </p>
        ) : (
          taskRows
        )}
      </div>

      <div className='space-y-uniform md:col-span-5'>
        {needsSetup ? (
          <PlannerSetupCard />
        ) : (
          <DailySummary key={plan.date} summary={summary} />
        )}

        <MotivationCard />
      </div>
    </div>
  );
}

function PlannerSetupCard() {
  const { setDialogOpen } = usePlannerDefaultsDialog();

  return (
    <Card className='gap-uniform'>
      <CardHeader className='text-section-title'>
        Looks like you&apos;re new here
      </CardHeader>

      <CardContent>
        <Button
          type='button'
          className='w-full'
          onClick={() => setDialogOpen(true)}
        >
          Set up your planner
        </Button>
      </CardContent>
    </Card>
  );
}

function ScheduleTaskItem({
  task,
  timezone,
  categoryMap,
}: {
  task: Task;
  timezone?: string;
  categoryMap: Map<string, TaskCategory>;
}) {
  const category = categoryMap.get(task.categoryId);

  if (!category)
    return (
      <p className='text-destructive text-sm'>
        Missing category for task {task.id}.
      </p>
    );

  return <TaskCard task={task} category={category} timezone={timezone} />;
}

function BreakRow({ durationMinutes }: { durationMinutes: number }) {
  return (
    <div className='text-muted-foreground flex items-center gap-2 py-1 text-xs'>
      <span className='bg-border h-px flex-1' aria-hidden='true' />

      <Coffee className='size-3 shrink-0' aria-hidden='true' />

      <span className='shrink-0'>{formatDuration(durationMinutes)} break</span>

      <span className='bg-border h-px flex-1' aria-hidden='true' />
    </div>
  );
}

function MotivationCard() {
  return (
    <Card size='sm' className='bg-transparent py-0 shadow-none ring-0'>
      <CardContent className='space-y-3 max-md:px-0'>
        <span
          className='text-primary block text-3xl leading-none'
          aria-hidden='true'
        >
          ✳
        </span>

        <h3 className='text-section-title'>Consistency over perfection</h3>

        <p className='text-section-description'>
          The plan can change, what matters is that you keep showing up
        </p>

        <span className='bg-border block h-px w-8' aria-hidden='true' />
      </CardContent>
    </Card>
  );
}
