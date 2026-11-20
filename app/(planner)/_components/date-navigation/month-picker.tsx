import { useState } from 'react';
import ChevronLeft from 'lucide-react/icons/chevron-left';
import ChevronRight from 'lucide-react/icons/chevron-right';

import DatePickerPopover from './date-picker-popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate, formatMonth } from '@/lib/dates';

const months = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1).padStart(2, '0');
  return {
    value,
    label: formatDate(`2000-${value}-01`, { month: 'short' }),
    name: formatDate(`2000-${value}-01`, { month: 'long' }),
  };
});

export default function MonthPicker({
  month,
  onSelect,
  minDate,
}: {
  month: string;
  onSelect: (month: string) => void;
  minDate: string;
}) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(month.slice(0, 4));
  const numericYear = Number(year);
  const minMonth = minDate.slice(0, 7);
  const minYear = Number(minDate.slice(0, 4));
  const validYear =
    /^\d{4}$/.test(year) && numericYear >= minYear && numericYear <= 9999;

  return (
    <DatePickerPopover
      dateTime={month}
      label={formatMonth(month)}
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setYear(month.slice(0, 4));
        setOpen(nextOpen);
      }}
    >
      <div className='mb-4 flex items-center justify-between gap-2'>
        <Button
          variant='ghost'
          size='icon-xs'
          className='disabled:border-border disabled:bg-muted disabled:text-muted-foreground/30 disabled:opacity-100'
          aria-label='Previous year'
          disabled={!validYear || numericYear <= minYear}
          onClick={() => setYear(String(numericYear - 1).padStart(4, '0'))}
        >
          <ChevronLeft aria-hidden='true' />
        </Button>

        <Input
          type='number'
          aria-label='Year'
          min={minYear}
          max={9999}
          value={year}
          onChange={(event) => setYear(event.target.value)}
          className='w-24 text-center tabular-nums'
        />

        <Button
          variant='ghost'
          size='icon-xs'
          className='disabled:border-border disabled:bg-muted disabled:text-muted-foreground/30 disabled:opacity-100'
          aria-label='Next year'
          disabled={!validYear || numericYear >= 9999}
          onClick={() => setYear(String(numericYear + 1).padStart(4, '0'))}
        >
          <ChevronRight aria-hidden='true' />
        </Button>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        {months.map(({ value, label, name }) => {
          const date = `${String(numericYear).padStart(4, '0')}-${value}`;
          return (
            <Button
              key={value}
              variant={date === month ? 'default' : 'ghost'}
              size='sm'
              disabled={!validYear || date < minMonth}
              aria-label={`${name} ${year}`}
              aria-pressed={date === month}
              onClick={() => {
                onSelect(date);
                setOpen(false);
              }}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </DatePickerPopover>
  );
}
