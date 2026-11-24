import Link from 'next/link';

import Logo from '@/components/logo';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className='bg-background flex flex-1 items-center justify-center px-6 py-12'>
      <div className='flex w-full max-w-sm flex-col items-center gap-6 text-center'>
        <Logo stacked />

        <div className='space-y-2'>
          <h1 className='text-heading'>Page not found</h1>

          <p className='text-body'>
            The page may have moved, or the address may be incorrect.
          </p>
        </div>

        <Link href='/' className={buttonVariants()}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
