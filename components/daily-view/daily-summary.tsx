import { BookOpen, CodeXml, FolderCode, type LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { DailyPlan, Task, TaskBlock, TaskCategory } from '@/lib/types';
import { cn, formatDuration } from '@/lib/utils';
import AdjustSplitDialog from './dialog-adjust-split';
import { ChangeDefaultsDialog } from './dialog-change-defaults';

type DailySummaryProps = {
  plan: DailyPlan;
  tasks: Task[];
  categories: TaskCategory[];
};

const categoryIcons: Record<string, LucideIcon> = {
  study: BookOpen,
  interview: CodeXml,
  project: FolderCode,
};

export default function DailySummary({ plan, tasks, categories }: DailySummaryProps) {
  const tasksById = new Map(tasks.map((task) => [task.id, task]));

  const taskBlocks = plan.blocks.filter(
    (block): block is TaskBlock => block.type === 'task' && block.date === plan.date,
  );

  const rows = categories.map((category) => {
    const blocks = taskBlocks.filter(
      (block) => tasksById.get(block.taskId)?.categoryId === category.id,
    );

    const plannedMinutes = blocks
      .filter((block) => block.status !== 'skipped')
      .reduce((total, block) => total + block.durationMinutes, 0);

    const completedMinutes = blocks.reduce(
      (total, block) => total + block.actualMinutes,
      0,
    );

    return {
      category,
      plannedMinutes,
      completedMinutes,
    };
  });

  const totalPlanned = rows.reduce((total, row) => total + row.plannedMinutes, 0);

  return (
    <Card>
      <CardHeader className='gap-1'>
        <h2 className='font-heading text-xl tracking-tight'>Nunc feugiat mi a tellus</h2>

        <p className='text-muted-foreground text-sm'>Donec lacus nunc, viverra nec.</p>
      </CardHeader>

      <CardContent className='space-y-uniform-half'>
        <CategorySplitBar rows={rows} totalPlanned={totalPlanned} />

        <div className='space-y-uniform-half'>
          {rows.map((row) => (
            <CategoryBreakdownRow
              key={row.category.id}
              category={row.category}
              plannedMinutes={row.plannedMinutes}
              completedMinutes={row.completedMinutes}
            />
          ))}
        </div>

        <PlannedTargetFooter
          totalPlanned={totalPlanned}
          targetMinutes={plan.targetMinutes}
        />

        <div className='space-y-2'>
          <AdjustSplitDialog />
          <ChangeDefaultsDialog />
        </div>
      </CardContent>
    </Card>
  );
}

type CategorySplitBarProps = {
  rows: {
    category: TaskCategory;
    plannedMinutes: number;
    completedMinutes: number;
  }[];
  totalPlanned: number;
};

function CategorySplitBar({ rows, totalPlanned }: CategorySplitBarProps) {
  return (
    <svg
      viewBox='0 0 100 6'
      preserveAspectRatio='none'
      className='bg-muted h-1.5 w-full overflow-hidden rounded-full'
      aria-hidden='true'
    >
      {totalPlanned > 0 &&
        rows.map((row, index) => {
          if (row.plannedMinutes === 0) return;

          const previousMinutes = rows
            .slice(0, index)
            .reduce((total, previous) => total + previous.plannedMinutes, 0);

          return (
            <rect
              key={row.category.id}
              x={(previousMinutes / totalPlanned) * 100}
              y={0}
              width={(row.plannedMinutes / totalPlanned) * 100}
              height={6}
              strokeWidth={0.5}
              className={cn('stroke-card', `fill-task-${row.category.color}`)}
            />
          );
        })}
    </svg>
  );
}

function CategoryBreakdownRow({
  category,
  plannedMinutes,
  completedMinutes,
}: {
  category: TaskCategory;
  plannedMinutes: number;
  completedMinutes: number;
}) {
  const Icon = categoryIcons[category.id] ?? BookOpen;

  return (
    <div className='flex items-center gap-3'>
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-lg',
          `bg-task-${category.color}/10 text-task-${category.color}`,
        )}
      >
        <Icon className='size-4.5' aria-hidden='true' />
      </span>

      <div className='min-w-0 flex-1 space-y-0.5'>
        <p className='text-sm font-medium wrap-break-word'>{category.name}</p>

        <p className='text-muted-foreground text-xs tabular-nums'>
          {formatDuration(completedMinutes)} completed
        </p>
      </div>

      <span className='shrink-0 text-sm font-medium tabular-nums'>
        {formatDuration(plannedMinutes)}
      </span>
    </div>
  );
}

function PlannedTargetFooter({
  totalPlanned,
  targetMinutes,
}: {
  totalPlanned: number;
  targetMinutes: number;
}) {
  const difference = targetMinutes - totalPlanned;
  const isBalanced = difference === 0;

  return (
    <div className='py-uniform-half mb-0 space-y-2 border-t'>
      <div className='flex items-center justify-between gap-3'>
        <span className='text-muted-foreground text-sm'>Total planned</span>

        <span
          className={cn(
            'text-sm font-medium tabular-nums',
            !isBalanced && 'text-amber-700 dark:text-amber-300',
          )}
        >
          {formatDuration(totalPlanned)}
          <span className='text-muted-foreground ml-1 font-normal'>
            / {formatDuration(targetMinutes)}
          </span>
        </span>
      </div>

      {!isBalanced && (
        <p className='text-muted-foreground text-xs'>
          {formatDuration(Math.abs(difference))}
          {difference > 0 ? 'left to schedule.' : 'above your daily target.'}
        </p>
      )}
    </div>
  );
}
