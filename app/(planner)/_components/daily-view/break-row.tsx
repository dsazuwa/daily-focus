import Coffee from 'lucide-react/icons/coffee';

import { formatDuration } from '@/lib/time';

export default function BreakRow({
  durationMinutes,
}: {
  durationMinutes: number;
}) {
  return (
    <div className='text-muted-foreground flex items-center gap-2 py-1 text-xs'>
      <span className='bg-border h-px flex-1' aria-hidden='true' />

      <Coffee className='size-3 shrink-0' aria-hidden='true' />

      <span className='shrink-0'>{formatDuration(durationMinutes)} break</span>

      <span className='bg-border h-px flex-1' aria-hidden='true' />
    </div>
  );
}
