import type { ReactNode } from 'react';
import ChevronLeft from 'lucide-react/icons/chevron-left';
import ChevronRight from 'lucide-react/icons/chevron-right';

import SaveStatus from './save-status';
import { Button } from '@/components/ui/button';

type DateToolbarProps = {
  children: ReactNode;
  period: 'day' | 'month';
  onPrevious?: () => void;
  onNext?: () => void;
  onReset?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  resetDisabled?: boolean;
};

export default function DateToolbar({
  children,
  period,
  onPrevious,
  onNext,
  onReset,
  previousDisabled = false,
  nextDisabled = false,
  resetDisabled = false,
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
            className='disabled:border-border disabled:bg-muted disabled:text-muted-foreground/30 disabled:opacity-100'
            aria-label={`Previous ${period}`}
            onClick={onPrevious}
            disabled={previousDisabled}
          >
            <ChevronLeft aria-hidden='true' />
          </Button>

          <div className='flex min-w-0 justify-center max-sm:flex-1 sm:min-w-54'>
            {children}
          </div>

          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            className='disabled:border-border disabled:bg-muted disabled:text-muted-foreground/30 disabled:opacity-100'
            aria-label={`Next ${period}`}
            onClick={onNext}
            disabled={nextDisabled}
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
          disabled={resetDisabled}
        >
          {period === 'day' ? 'Today' : 'This month'}
        </Button>
      </div>

      <SaveStatus />
    </div>
  );
}
