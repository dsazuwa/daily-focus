import SummaryCard, { SummaryStat } from '../summary-card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDuration } from '@/lib/time';

export default function MonthStats({
  plannedMinutes,
  daysPlanned,
  targetsPlanned,
}: {
  plannedMinutes: number;
  daysPlanned: number;
  targetsPlanned: number;
}) {
  return (
    <SummaryCard
      title="How's your month shaping up?"
      description='See how many days you planned and how much time you set aside.'
    >
      <CardContent
        className='flex shrink-0 justify-between gap-4 max-sm:flex-wrap md:flex-1 md:gap-[calc(var(--card-spacing)/2)] md:pl-0'
        aria-live='polite'
      >
        <SummaryStat label='days planned' value={daysPlanned} />

        <Separator orientation='vertical' />

        <SummaryStat
          label='time planned'
          value={formatDuration(plannedMinutes)}
        />

        <Separator orientation='vertical' />

        <SummaryStat label='targets planned' value={targetsPlanned} />
      </CardContent>
    </SummaryCard>
  );
}
