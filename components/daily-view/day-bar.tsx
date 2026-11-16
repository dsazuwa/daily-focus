import CalendarDays from 'lucide-react/icons/calendar-days';
import ChevronLeft from 'lucide-react/icons/chevron-left';
import ChevronRight from 'lucide-react/icons/chevron-right';

import SaveStatus from '../save-status';
import { Button } from '@/components/ui/button';

export default function DayBar({ selectedDate }: { selectedDate: Date }) {
  const date = selectedDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='flex flex-wrap items-center justify-between gap-2'>
      <div className='flex w-full flex-wrap items-center gap-2 max-sm:justify-between sm:w-auto sm:flex-1'>
        <div
          role='group'
          aria-label='Date navigation'
          className='flex items-center gap-2 max-sm:flex-1'
        >
          <Button type='button' variant='ghost' size='icon-xs' aria-label='Previous Day'>
            <ChevronLeft aria-hidden='true' />
          </Button>

          <time
            aria-live='polite'
            className='flex items-center justify-center gap-1 self-stretch px-1 text-center text-xs font-medium tabular-nums select-none max-sm:flex-1 sm:min-w-48'
          >
            <CalendarDays className='size-4 shrink-0' aria-hidden='true' />
            <span>{date}</span>
          </time>

          <Button type='button' variant='ghost' size='icon-xs' aria-label='Next Day'>
            <ChevronRight aria-hidden='true' />
          </Button>
        </div>

        <Button type='button' variant='outline' size='sm' className='text-xxs'>
          Today
        </Button>
      </div>

      <SaveStatus />
    </div>
  );
}
