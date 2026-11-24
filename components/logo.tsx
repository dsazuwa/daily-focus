import { Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function Logo({ stacked = false }: { stacked?: boolean }) {
  return (
    <span
      className={cn(
        'text-foreground inline-flex items-center font-bold tracking-tight',
        stacked ? 'flex-col gap-6 text-4xl' : 'gap-2 text-2xl',
      )}
    >
      <span
        className={cn(
          'text-primary-foreground bg-primary grid place-items-center',
          stacked ? 'size-14 rounded-2xl' : 'size-9.25 rounded-[11px]',
        )}
      >
        <Sun className={stacked ? 'size-8' : 'size-6'} aria-hidden='true' />
      </span>

      <span>
        daily<span className='font-normal'>focus</span>.
      </span>
    </span>
  );
}
