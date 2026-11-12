import { Sun } from 'lucide-react';

export default function Logo() {
  return (
    <div
      className='inline-flex items-center text-2xl font-bold tracking-tight text-emerald-900'
      aria-label='Daily Focus Logo'
    >
      <span className='mr-2 grid place-items-center rounded-[11px] bg-emerald-800 size-9.25'>
        <Sun size={24} className='text-muted' />
      </span>
      daily
      <span className='font-normal'>focus</span>.
    </div>
  );
}
