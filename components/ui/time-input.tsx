import { Clock } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function TimeInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, 'type'>) {
  return (
    <div className='relative'>
      <Input
        {...props}
        type='time'
        className={cn(
          'relative pr-8 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:size-3.5 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-datetime-edit]:p-0',
          className,
        )}
      />

      <Clock
        aria-hidden='true'
        className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 hidden size-3.5 -translate-y-1/2 supports-[selector(::-webkit-calendar-picker-indicator)]:block'
      />
    </div>
  );
}
