import Logo from '@/components/logo';
import { ChangeDefaultsDialog } from '@/components/setings/change-defaults';
import LogoutButton from './logout-button';
import ThemeToggle from './theme-toggle';

export default function AppBar() {
  return (
    <header className='border-border flex min-h-16 w-full border-b border-solid sm:h-16'>
      <div className='container mx-auto flex items-center px-4 max-sm:flex-wrap max-sm:gap-2 max-sm:py-2'>
        <div className='flex flex-1'>
          <Logo />
        </div>

        <div className='flex items-center gap-1'>
          <ThemeToggle />

          <ChangeDefaultsDialog />

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
