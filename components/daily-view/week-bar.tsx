import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function getWeekDays(referenceDate: Date = new Date()) {
  const now = new Date();
  const todayString = now.toDateString();

  const target = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  const sunday = new Date(target);
  sunday.setDate(target.getDate() - target.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);

    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      dateKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      isSelected: date.getTime() === target.getTime(),
      isToday: date.toDateString() === todayString,
    };
  });
}

export default function WeekBar() {
  const selectedDate = new Date();
  const days = getWeekDays(selectedDate);

  return (
    <nav
      aria-label='Days this week'
      className='flex flex-wrap items-center gap-1.5 sm:gap-2'
    >
      {days.map(({ dayName, dayNumber, dateKey, isSelected, isToday }) => (
        <Button
          key={dateKey}
          type='button'
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
