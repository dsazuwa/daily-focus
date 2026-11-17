import { useState } from 'react';
import ChevronLeft from 'lucide-react/icons/chevron-left';
import ChevronRight from 'lucide-react/icons/chevron-right';

import DatePickerPopover from './date-picker-popover';
import MonthPicker from './month-picker';
import { Button } from '@/components/ui/button';
import {
  formatDate,
  getMonthDays,
  parseDateKey,
  WEEKDAY_LABELS,
} from '@/lib/dates';
import { cn } from '@/lib/utils';

export default function DayPicker({
  selectedDate,
  today,
  onSelect,
  minDate,
}: {
  selectedDate: string;
  today: string;
  onSelect: (date: string) => void;
  minDate: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(selectedDate.slice(0, 7));

  const changeMonth = (offset: number) => {
    const date = parseDateKey(`${month}-01`);
    date.setUTCMonth(date.getUTCMonth() + offset);
    setMonth(date.toISOString().slice(0, 7));
  };

  return (
    <DatePickerPopover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setMonth(selectedDate.slice(0, 7));
        setOpen(nextOpen);
      }}
      dateTime={selectedDate}
      label={formatDate(selectedDate)}
    >
      <div className='mb-3 flex items-center justify-between gap-1'>
        <Button
          variant='ghost'
          size='icon-xs'
          className='disabled:border-border disabled:bg-muted disabled:text-muted-foreground/30 disabled:opacity-100'
          aria-label='Previous month'
          disabled={month <= minDate.slice(0, 7)}
          onClick={() => changeMonth(-1)}
        >
          <ChevronLeft aria-hidden='true' />
        </Button>

        <MonthPicker month={month} onSelect={setMonth} minDate={minDate} />

        <Button
          variant='ghost'
          size='icon-xs'
          className='disabled:border-border disabled:bg-muted disabled:text-muted-foreground/30 disabled:opacity-100'
          aria-label='Next month'
          disabled={month >= '9999-11'}
          onClick={() => changeMonth(1)}
        >
          <ChevronRight aria-hidden='true' />
        </Button>
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {WEEKDAY_LABELS.map((day) => (
          <span
            key={day}
            className='text-muted-foreground text-xxs py-1 text-center'
            aria-hidden='true'
          >
            {day}
          </span>
        ))}

        {getMonthDays(month).map((date) => (
          <Button
            key={date}
            variant={date === selectedDate ? 'default' : 'ghost'}
            size='icon-xs'
            className={cn(
              'w-full tracking-normal',
              !date.startsWith(month) && 'text-muted-foreground',
              date === today && 'ring-primary ring-1 ring-inset',
            )}
            disabled={date < minDate}
            aria-label={formatDate(date)}
            aria-pressed={date === selectedDate}
            aria-current={date === today ? 'date' : undefined}
            onClick={() => {
              onSelect(date);
              setOpen(false);
            }}
          >
            {Number(date.slice(-2))}
          </Button>
        ))}
      </div>
    </DatePickerPopover>
  );
}
