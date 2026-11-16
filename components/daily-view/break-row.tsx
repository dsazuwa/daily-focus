import Coffee from 'lucide-react/icons/coffee';

import type { BreakBlock } from '@/lib/types';
import { formatDuration } from '@/lib/time';
import { cn } from '@/lib/utils';

export default function BreakRow({ block }: { block: BreakBlock }) {
  const isSkipped = block.status === 'skipped';

  return (
    <div className='text-muted-foreground flex items-center gap-2 py-1 text-xs'>
      <span className='bg-border h-px flex-1' aria-hidden='true' />

      <Coffee className='size-3 shrink-0' aria-hidden='true' />

      <span className={cn('shrink-0', isSkipped && 'line-through opacity-60')}>
        {formatDuration(block.durationMinutes)} break
      </span>

      {isSkipped && <span>Skipped</span>}

      <span className='bg-border h-px flex-1' aria-hidden='true' />
    </div>
  );
}
