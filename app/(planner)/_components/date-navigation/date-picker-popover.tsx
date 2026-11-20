import type { ReactNode } from 'react';
import ChevronDown from 'lucide-react/icons/chevron-down';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateTime: string;
  label: string;
  title?: string;
  children: ReactNode;
};

export default function DatePickerPopover({
  open,
  onOpenChange,
  dateTime,
  label,
  title = 'Choose date',
  children,
}: DatePickerPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        className='hover:bg-muted focus-visible:outline-ring flex min-h-7 min-w-0 items-center justify-center gap-1 px-1 text-xs font-medium tabular-nums outline-none focus-visible:outline-2 sm:gap-2 sm:text-sm'
        aria-label={`${title}, ${label}`}
      >
        <time dateTime={dateTime} aria-live='polite' className='truncate'>
          {label}
        </time>

        <ChevronDown className='size-3 shrink-0' aria-hidden='true' />
      </PopoverTrigger>

      <PopoverContent sideOffset={8} className='max-w-[calc(100vw-2rem)] gap-0'>
        {children}
      </PopoverContent>
    </Popover>
  );
}
