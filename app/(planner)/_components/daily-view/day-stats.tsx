import type { CSSProperties } from 'react';

import SummaryCard, { SummaryStat } from '../summary-card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { DailySummaryData } from '@/lib/daily-summary';

const formatHours = (minutes: number) =>
  `${Number((minutes / 60).toFixed(1))}h`;

export default function DayStats({ summary }: { summary: DailySummaryData }) {
  const { completedMinutes, remainingMinutes, progressPercentage } = summary;

  return (
    <SummaryCard
      title="How's your day going?"
      description="See how much of your goal you've reached so far."
    >
      <CardContent className='flex shrink-0 justify-between gap-4 max-sm:flex-wrap md:gap-(--card-spacing) md:pl-0'>
        <div className='inline-flex gap-4 max-sm:flex-wrap md:gap-[calc(var(--card-spacing)/2)]'>
          <SummaryStat
            label='Completed'
            value={formatHours(completedMinutes)}
          />

          <Separator orientation='vertical' />

          <SummaryStat
            label='Remaining'
            value={
              summary.targetMinutes === undefined
                ? '-'
                : formatHours(remainingMinutes)
            }
          />
        </div>

        <ProgressRing
          progress={summary.targetMinutes == undefined ? 0 : progressPercentage}
        />
      </CardContent>
    </SummaryCard>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      className='grid size-18 place-items-center rounded-full bg-[conic-gradient(var(--primary-foreground)_var(--progress,0%),color-mix(in_srgb,var(--primary),white_18%)_0%)] p-1'
      style={{ '--progress': `${clampedProgress}%` } as CSSProperties}
      role='progressbar'
      aria-label='Daily goal progress'
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className='bg-primary flex size-full shrink-0 flex-col items-center justify-center rounded-full text-center'>
        <strong className='text-stat'>
          {clampedProgress}
          <span className='text-sm'>%</span>
        </strong>
      </div>
    </div>
  );
}
