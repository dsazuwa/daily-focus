import Coffee from 'lucide-react/icons/coffee';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { DailySummaryData } from '@/lib/daily-summary';
import { formatDuration } from '@/lib/time';
import type { DailyPlan, TaskCategory } from '@/lib/types';
import { usePlannerDefaultsDialog } from '../planner-defaults-provider';
import { TaskDialog } from './task-dialog';
import DailySummary from './daily-summary';
import TaskCard from './task-card';

type DailyContentProps = {
  plan: DailyPlan;
  summary: DailySummaryData;
  needsSetup: boolean;
  categories: TaskCategory[];
  timezone?: string;
};

export default function DailyContent({
  plan,
  categories,
  summary,
  needsSetup,
  timezone,
}: DailyContentProps) {
  let scheduledUntil: number | undefined;
  const taskRows: ReactNode[] = [];

  for (const task of plan.tasks) {
    const startMinutes = task.startOffsetMinutes;

    const gapMinutes =
      scheduledUntil === undefined ? 0 : startMinutes - scheduledUntil;

    const endMinutes = startMinutes + task.durationMinutes;
    scheduledUntil = Math.max(scheduledUntil ?? endMinutes, endMinutes);

    taskRows.push(
      <div key={task.id} className='space-y-3'>
        {gapMinutes > 0 && <BreakRow durationMinutes={gapMinutes} />}

        <TaskCard
          task={task}
          categories={categories}
          timezone={timezone}
          date={plan.date}
        />
      </div>,
    );
  }

  return (
    <div className='gap-uniform grid md:grid-cols-12'>
      <div className='space-y-3 md:col-span-7'>
        <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
          <div className='space-y-1'>
            <div className='flex items-start gap-2'>
              <h2 className='text-section-title'>Your tasks</h2>

              <Badge
                variant='secondary'
                className='bg-muted min-w-5 px-1.5 py-0.5 tabular-nums'
                aria-label={`${plan.tasks.length} scheduled tasks`}
              >
                {plan.tasks.length}
              </Badge>
            </div>

            <p className='text-section-description'>
              Breaks don&apos;t count toward your goal
            </p>
          </div>

          {timezone && categories.length > 0 && (
            <TaskDialog
              key={plan.date}
              categories={categories}
              timezone={timezone}
              date={plan.date}
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
