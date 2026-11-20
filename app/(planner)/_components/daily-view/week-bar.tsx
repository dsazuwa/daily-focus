import { getWeekDays } from '@/lib/dates';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function WeekBar({
  selectedDate,
  today,
  onSelectDate,
  minDate,
}: {
  selectedDate: string;
  today: string;
  onSelectDate: (date: string) => void;
  minDate: string;
}) {
  const days = getWeekDays(selectedDate, today);

  return (
    <nav
      aria-label='Days this week'
      className='flex flex-wrap items-center gap-1.5 sm:gap-2'
    >
      {days.map(({ dayName, dayNumber, dateKey, isSelected, isToday }) => (
        <Button
          key={dateKey}
          type='button'
          onClick={() => onSelectDate(dateKey)}
          disabled={dateKey < minDate}
          variant={isSelected ? 'default' : 'outline'}
          aria-current={isSelected ? 'date' : undefined}
          className={cn(
            'relative min-h-12 min-w-10 flex-1 flex-col gap-0.5 tabular-nums sm:min-h-14 md:min-h-16',
            !isSelected && 'text-muted-foreground hover:text-foreground',
          )}
        >
          <span className='text-xxs font-medium'>{dayName}</span>
          <strong className='text-xs leading-none font-bold md:text-sm'>
            {dayNumber}
          </strong>

          {isToday && (
            <span
              aria-hidden='true'
              className={cn(
                'absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full md:bottom-1.25',
                isSelected ? 'bg-primary-foreground' : 'bg-primary',
              )}
            />
          )}
        </Button>
      ))}
    </nav>
  );
}
