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
  const targetPlanned = Boolean(
    summary &&
    summary.targetMinutes > 0 &&
    summary.plannedMinutes >= summary.targetMinutes,
  );

  const showSummary = !outsideMonth && Boolean(summary);
  const label = [
    `Open ${formatDate(date)}`,
    ...(isLastOpened ? ['last opened day'] : []),
    ...(summary ? [`${formatDuration(summary.plannedMinutes)} planned`] : []),
    ...(targetPlanned ? ['daily target planned'] : []),
  ].join(', ');

  return (
    <button
      type='button'
      disabled={disabled}
      aria-label={label}
      aria-current={isToday ? 'date' : undefined}
      onClick={() => onSelect(date)}
      className={cn(
        'hover:bg-accent/50 focus-visible:outline-ring relative flex min-h-24 min-w-0 flex-col gap-3 p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 sm:min-h-36 sm:p-4',
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

        {showSummary && <DayIndicator targetPlanned={targetPlanned} />}
      </span>

      {!outsideMonth && summary && <DayProgress summary={summary} />}
    </button>
  );
}

function DayIndicator({ targetPlanned }: { targetPlanned: boolean }) {
  return targetPlanned ? (
    <Check className='text-primary size-3 shrink-0' aria-hidden='true' />
  ) : (
    <span
      className='bg-primary size-1.5 shrink-0 rounded-full'
      aria-hidden='true'
    />
  );
}

function DayProgress({ summary }: { summary: CalendarDaySummary }) {
  const progressPercentage = Math.min(
    100,
    Math.round((summary.plannedMinutes / summary.targetMinutes) * 100),
  );

  return (
    <span className='mt-auto flex w-full flex-col gap-1.5'>
      <span className='text-xxs font-semibold tabular-nums sm:text-xs md:text-sm'>
        {formatDuration(summary.plannedMinutes)} planned
      </span>

      <span
        className='bg-muted block h-1 overflow-hidden rounded-full'
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
