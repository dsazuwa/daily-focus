import { Check } from 'lucide-react';

export function TotalAllocation({
  allocatedHours,
  targetHours,
  balanced,
}: {
  allocatedHours: number;
  targetHours: number | string;
  balanced: boolean;
}) {
  return (
    <div
      className='flex items-center justify-between gap-2 text-xs font-semibold uppercase'
      aria-live='polite'
    >
      <span>Total allocated</span>

      <span className='flex items-center gap-2 lowercase tabular-nums'>
        {allocatedHours} / {targetHours === '' ? '—' : targetHours} hrs
        {balanced && <Check className='size-4' aria-hidden='true' />}
      </span>
    </div>
  );
}
