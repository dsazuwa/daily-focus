import Check from 'lucide-react/icons/check';

import { getDailySummary, type DailySummaryData } from '@/lib/daily-summary';
import { formatDate } from '@/lib/dates';
import { formatDuration } from '@/lib/time';
import type { DailyPlan } from '@/lib/types';
import { cn } from '@/lib/utils';

type CalendarDayProps = {
  date: string;
  plan?: DailyPlan;
  outsideMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  className?: string;
  onSelect: (date: string) => void;
  disabled?: boolean;
};

export default function CalendarDay({
  date,
  plan,
  outsideMonth,
  isToday,
  isSelected,
  className,
  onSelect,
  disabled = false,
}: CalendarDayProps) {
  const summary = plan ? getDailySummary(plan, [], []) : undefined;
  const goalMet = Boolean(
    summary &&
    summary.targetMinutes > 0 &&
    summary.completedMinutes >= summary.targetMinutes,
  );

  const showSummary = !outsideMonth && Boolean(summary);
  const label = [
    `Open ${formatDate(date)}`,
    ...(summary
      ? [
          `${formatDuration(summary.completedMinutes)} completed`,
          `${formatDuration(summary.plannedMinutes)} planned`,
        ]
      : []),
    ...(goalMet ? ['goal met'] : []),
  ].join(', ');

  return (
    <button
      type='button'
      disabled={disabled}
      aria-label={label}
      aria-current={isToday ? 'date' : undefined}
      aria-pressed={isSelected}
      onClick={() => onSelect(date)}
      className={cn(
        'hover:bg-accent/50 focus-visible:outline-ring relative flex min-h-24 min-w-0 flex-col gap-3 p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 sm:min-h-36 sm:p-4',
        className,
        disabled && 'pointer-events-none opacity-50',
        outsideMonth && 'bg-muted text-muted-foreground',
        isSelected && 'bg-primary/5 ring-primary ring-2 ring-inset',
      )}
    >
      <span className='flex w-full items-center justify-between gap-1'>
        <span
          className={cn(
            'grid size-6 place-items-center rounded-full text-xs font-medium sm:size-7 sm:text-sm',
            isToday && 'bg-primary text-primary-foreground',
          )}
        >
          {Number(date.slice(-2))}
        </span>

        {showSummary && <DayIndicator goalMet={goalMet} />}
      </span>

      {!outsideMonth && summary && <DayProgress summary={summary} />}
    </button>
  );
}

function DayIndicator({ goalMet }: { goalMet: boolean }) {
  return goalMet ? (
    <Check className='text-primary size-3 shrink-0' aria-hidden='true' />
  ) : (
    <span
      className='bg-primary size-1.5 shrink-0 rounded-full'
      aria-hidden='true'
    />
  );
}

function DayProgress({ summary }: { summary: DailySummaryData }) {
  return (
    <span className='mt-auto flex w-full flex-col gap-1.5'>
      <span className='text-xxs font-semibold tabular-nums sm:text-xs md:text-sm'>
        {formatDuration(summary.completedMinutes)}
      </span>

      <span className='text-muted-foreground hidden text-xs sm:block'>
        {formatDuration(summary.plannedMinutes)} planned
      </span>

      <span
        className='bg-muted block h-1 overflow-hidden rounded-full'
        aria-hidden='true'
      >
        <span
          className='bg-primary block h-full'
          style={{ width: `${summary.progressPercentage}%` }}
        />
      </span>
    </span>
  );
}
