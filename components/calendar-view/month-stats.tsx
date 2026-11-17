import SummaryCard, { SummaryStat } from '@/components/summary-card';
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
      title='Quisque tempus, tellus vitae cursus.'
      description='Donec varius sem vel justo, at posuere neque facilisis.'
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

        <SummaryStat label='8h goals met' value={goalsMet} />
      </CardContent>
    </SummaryCard>
  );
}
