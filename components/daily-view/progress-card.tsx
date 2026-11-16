import type { CSSProperties } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { DailySummaryData } from '@/lib/daily-summary';

const formatHours = (minutes: number) =>
  `${Number((minutes / 60).toFixed(1))}h`;
export default function ProgressCard({
  summary,
}: {
  summary: DailySummaryData;
}) {
  const {
    completedMinutes,
    remainingMinutes,
    targetMinutes,
    progressPercentage,
  } = summary;

  return (
    <Card className='bg-primary text-primary-foreground ring-0 md:flex-row md:items-center md:justify-between'>
      <CardHeader className='flex-1'>
        <CardTitle>
          Duis aute irure dolor in reprehenderit in voluptate.
        </CardTitle>

        <CardDescription className='text-primary-foreground/80'>
          Ut enim ad minim veniam, quis nostrud exercitation
        </CardDescription>
      </CardHeader>

      <CardContent className='flex shrink-0 justify-between gap-4 max-sm:flex-wrap md:gap-(--card-spacing)'>
        <div className='inline-flex gap-4 max-sm:flex-wrap md:gap-[calc(var(--card-spacing)/2)]'>
          <ProgressStat
            name='Completed'
            value={formatHours(completedMinutes)}
          />
          <Separator orientation='vertical' />
          <ProgressStat
            name='Remaining'
            value={formatHours(remainingMinutes)}
          />
        </div>

        <ProgressRing
          progress={progressPercentage}
          goalText={formatHours(targetMinutes)}
        />
      </CardContent>
    </Card>
  );
}

function ProgressStat({ name, value }: { name: string; value: string }) {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <span className='text-eyebrow'>{name}</span>
      <span className='text-stat'>{value}</span>
    </div>
  );
}

function ProgressRing({
  progress,
  goalText,
}: {
  progress: number;
  goalText?: string;
}) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      className='grid size-18 place-items-center rounded-full bg-[conic-gradient(var(--primary-foreground)_var(--progress,0%),color-mix(in_srgb,var(--primary),white_18%)_0%)] p-1'
      style={{ '--progress': `${clampedProgress}%` } as CSSProperties}
      role='progressbar'
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className='bg-primary flex size-full shrink-0 flex-col items-center justify-center rounded-full text-center'>
        <strong className='text-stat'>
          {clampedProgress}
          <span className='text-sm'>%</span>
        </strong>
        {goalText && (
          <span className='text-xxs mt-1 md:text-xs'>{`of ${goalText} goal`}</span>
        )}
      </div>
    </div>
  );
}
