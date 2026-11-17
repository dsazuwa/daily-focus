import ChevronLeft from 'lucide-react/icons/chevron-left';
import ChevronRight from 'lucide-react/icons/chevron-right';

import SaveStatus from '@/components/save-status';
import { Button } from '@/components/ui/button';

type DateToolbarProps = {
  dateTime: string;
  label: string;
  period: 'day' | 'month';
  onPrevious?: () => void;
  onNext?: () => void;
  onReset?: () => void;
};

export default function DateToolbar({
  dateTime,
  label,
  period,
  onPrevious,
  onNext,
  onReset,
}: DateToolbarProps) {
  return (
    <div className='flex flex-wrap items-center justify-between gap-2'>
      <div className='flex w-full flex-wrap items-center gap-2 max-sm:justify-between sm:w-auto sm:flex-1'>
        <div
          className='flex items-center gap-2 max-sm:flex-1'
          role='group'
          aria-label={`${period === 'day' ? 'Date' : 'Month'} navigation`}
        >
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            aria-label={`Previous ${period}`}
            onClick={onPrevious}
          >
            <ChevronLeft aria-hidden='true' />
          </Button>

          <time
            dateTime={dateTime}
            className='flex items-center justify-center gap-1 self-stretch px-1 text-center text-xs font-medium tabular-nums select-none max-sm:flex-1 sm:min-w-48 sm:text-sm'
            aria-live='polite'
          >
            {label}
          </time>

          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            aria-label={`Next ${period}`}
            onClick={onNext}
          >
            <ChevronRight aria-hidden='true' />
          </Button>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          className='text-xxs'
          onClick={onReset}
        >
          {period === 'day' ? 'Today' : 'This month'}
        </Button>
      </div>
      <SaveStatus />
    </div>
  );
}
