import { Sun } from 'lucide-react';

export default function Logo() {
  return (
    <div
      className='text-foreground inline-flex items-center text-2xl font-bold tracking-tight'
      aria-label='Daily Focus Logo'
    >
      <span className='text-primary-foreground bg-primary mr-2 grid size-9.25 place-items-center rounded-[11px]'>
        <Sun className='size-6' aria-hidden='true' />
      </span>
      daily
      <span className='font-normal'>focus</span>.
    </div>
  );
}
