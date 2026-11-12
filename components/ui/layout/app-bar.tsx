import { Settings2, User } from 'lucide-react';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';

export default function AppBar() {
  return (
    <header className='flex h-16 w-full border-b border-solid border-black/8 dark:border-white/[.145]'>
      <div className='container mx-auto flex items-center px-4'>
        <div className='flex flex-1'>
          <Logo />
        </div>

        <div className='flex items-center gap-1'>
          <ThemeToggle />

          <Button variant='ghost'>
            <Settings2 />
          </Button>

          <Button variant='ghost'>
            <User />
          </Button>
        </div>
      </div>
    </header>
  );
}
