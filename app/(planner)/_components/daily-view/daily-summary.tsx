import AdjustSplitDialog from '../settings/adjust-split';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CategorySummary, DailySummaryData } from '@/lib/daily-summary';
import { formatDuration } from '@/lib/time';
import type { TaskCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '../category-icon';

type DailySummaryProps = { summary: DailySummaryData; startTime?: string };

export default function DailySummary({
  summary,
  startTime,
}: DailySummaryProps) {
  const { rows, plannedMinutes: totalPlanned, targetMinutes } = summary;

  return (
    <Card className='gap-uniform'>
      <CardHeader className='text-section-title'>
        Where your time goes
      </CardHeader>

      <CardContent className='space-y-uniform'>
        <CategorySplitBar rows={rows} totalPlanned={totalPlanned} />

        <div className='space-y-uniform'>
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
          targetMinutes={targetMinutes}
        />

        <AdjustSplitDialog summary={summary} initialStartTime={startTime} />
      </CardContent>
    </Card>
  );
}

type CategorySplitBarProps = {
  rows: CategorySummary[];
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
  return (
    <div className='flex items-center gap-3'>
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-lg',
          `bg-task-${category.color}/10 text-task-${category.color}`,
        )}
      >
        <CategoryIcon
          name={category.icon}
          className='size-4.5'
          aria-hidden='true'
        />
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
    <div className='py-uniform mb-0 flex items-center justify-between gap-2 border-t'>
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
  );
}
