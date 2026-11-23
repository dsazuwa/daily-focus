import SummaryCard, { SummaryStat } from '../summary-card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDuration } from '@/lib/time';

export default function MonthStats({
  completedMinutes,
  daysPlanned,
  goalsMet,
}: {
  completedMinutes: number;
  daysPlanned: number;
  goalsMet: number;
}) {
  return (
    <SummaryCard
      title="How's your month shaping up?"
      description='Look back at the days you planned and the time you put in.'
    >
      <CardContent
        className='flex shrink-0 justify-between gap-4 max-sm:flex-wrap md:flex-1 md:gap-[calc(var(--card-spacing)/2)] md:pl-0'
        aria-live='polite'
      >
        <SummaryStat label='days planned' value={daysPlanned} />

        <Separator orientation='vertical' />

        <SummaryStat
          label='completed'
          value={
            completedMinutes === 0 ? '0h' : formatDuration(completedMinutes)
          }
        />

        <Separator orientation='vertical' />

        <SummaryStat label='goals met' value={goalsMet} />
      </CardContent>
    </SummaryCard>
  );
}
