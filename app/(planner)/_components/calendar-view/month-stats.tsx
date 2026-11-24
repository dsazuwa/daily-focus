import SummaryCard, { SummaryStat } from '../summary-card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDuration } from '@/lib/time';

export default function MonthStats({
  completedMinutes,
  daysPlanned,
  targetsMet,
}: {
  completedMinutes: number;
  daysPlanned: number;
  targetsMet: number;
}) {
  return (
    <SummaryCard
      title="How's your month shaping up?"
      description='See how many days you planned and how much time you completed.'
    >
      <CardContent
        className='flex shrink-0 justify-between gap-4 max-sm:flex-wrap md:flex-1 md:gap-[calc(var(--card-spacing)/2)] md:pl-0'
        aria-live='polite'
      >
        <SummaryStat label='days planned' value={daysPlanned} />

        <Separator orientation='vertical' />

        <SummaryStat
          label='hours completed'
          value={formatDuration(completedMinutes)}
        />

        <Separator orientation='vertical' />

        <SummaryStat label='targets met' value={targetsMet} />
      </CardContent>
    </SummaryCard>
  );
}
