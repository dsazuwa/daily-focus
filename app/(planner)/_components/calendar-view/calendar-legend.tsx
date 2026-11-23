import Check from 'lucide-react/icons/check';

export default function CalendarLegend() {
  return (
    <div className='text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-xs'>
      <span className='inline-flex items-center gap-2'>
        <span
          className='bg-primary size-1.5 shrink-0 rounded-full'
          aria-hidden='true'
        />
        Planned day
      </span>

      <span className='inline-flex items-center gap-2'>
        <Check className='text-primary size-3 shrink-0' aria-hidden='true' />
        Daily goal met
      </span>

      <span className='w-full sm:ml-auto sm:w-auto' role='status'>
        Select a date to open its plan.
      </span>
    </div>
  );
}
