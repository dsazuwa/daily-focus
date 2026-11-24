import ArrowUpRight from 'lucide-react/icons/arrow-up-right';
import Check from 'lucide-react/icons/check';

import { formatDate } from '@/lib/dates';
import { formatDuration } from '@/lib/time';
import type { CalendarDaySummary } from '@/lib/types';
import { cn } from '@/lib/utils';

type CalendarDayProps = {
  date: string;
  summary?: CalendarDaySummary;
  outsideMonth: boolean;
  isToday: boolean;
  isLastOpened: boolean;
  className?: string;
  onSelect: (date: string) => void;
  disabled?: boolean;
};

export default function CalendarDay({
  date,
  summary,
  outsideMonth,
  isToday,
  isLastOpened,
  className,
  onSelect,
  disabled = false,
}: CalendarDayProps) {
  const targetMet = Boolean(
    summary &&
    summary.targetMinutes !== undefined &&
    summary.completedMinutes >= summary.targetMinutes,
  );

  const showSummary = !outsideMonth && Boolean(summary);
  const showPlanHint = !outsideMonth && !summary && !disabled;
  const label = [
    `${showPlanHint ? 'Plan' : 'Open'} ${formatDate(date)}`,
    ...(isLastOpened ? ['last opened day'] : []),
    ...(summary
      ? [
          `${formatDuration(summary.completedMinutes)} completed out of ${formatDuration(summary.targetMinutes)}`,
          `${formatDuration(summary.plannedMinutes)} planned`,
        ]
      : []),
    ...(targetMet ? ['daily target met'] : []),
  ].join(', ');

  return (
    <button
      type='button'
      disabled={disabled}
      aria-label={label}
      aria-current={isToday ? 'date' : undefined}
      onClick={() => onSelect(date)}
      className={cn(
        'group/calendar-day hover:bg-accent/50 focus-visible:outline-ring relative flex min-h-24 min-w-0 flex-col gap-3 p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 sm:min-h-36 sm:p-4',
        className,
        disabled && 'pointer-events-none opacity-50',
        outsideMonth && 'bg-muted text-muted-foreground',
        isLastOpened && 'bg-primary/5 ring-primary ring-2 ring-inset',
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

        {showSummary && <DayIndicator targetMet={targetMet} />}
      </span>

      {!outsideMonth && summary && <DayProgress summary={summary} />}

      {showPlanHint && (
        <span
          aria-hidden='true'
          className='text-muted-foreground text-xxs mt-auto flex flex-wrap items-center gap-x-1 leading-tight opacity-0 transition-opacity group-hover/calendar-day:opacity-100 group-focus-visible/calendar-day:opacity-100'
        >
          Plan day
          <ArrowUpRight className='size-3 shrink-0' />
        </span>
      )}
    </button>
  );
}

function DayIndicator({ targetMet }: { targetMet: boolean }) {
  return targetMet ? (
    <Check className='text-primary size-3 shrink-0' aria-hidden='true' />
  ) : (
    <span
      className='bg-primary size-1.5 shrink-0 rounded-full'
      aria-hidden='true'
    />
  );
}

function DayProgress({ summary }: { summary: CalendarDaySummary }) {
  const progressPercentage = summary.targetMinutes
    ? Math.min(
        100,
        Math.round((summary.completedMinutes / summary.targetMinutes) * 100),
      )
    : 0;

  return (
    <span className='mt-auto flex w-full flex-col gap-1.5'>
      <strong className='text-xs/none font-bold tabular-nums sm:text-sm/none'>
        {formatDuration(summary.completedMinutes)}
      </strong>

      <span className='text-muted-foreground text-xxs leading-none tabular-nums sm:text-xs/none'>
        {formatDuration(summary.plannedMinutes)}{' '}
        <span className='sm:hidden'>plan</span>
        <span className='hidden sm:inline'>planned</span>
      </span>

      <span
        className='bg-muted-foreground/25 block h-1 w-full shrink-0 overflow-hidden rounded-full'
        aria-hidden='true'
      >
        <span
          className='bg-primary block h-full'
          style={{ width: `${progressPercentage}%` }}
        />
      </span>
    </span>
  );
}
