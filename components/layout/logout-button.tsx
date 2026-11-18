'use client';

import LoaderCircle from 'lucide-react/icons/loader-circle';
import LogOut from 'lucide-react/icons/log-out';
import { useActionState } from 'react';

import { logout } from '@/app/actions/logout';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function LogoutButton() {
  const [, action, pending] = useActionState(
    async () => {
      const result = await logout();

      if (result.error)
        toast.add({
          type: 'error',
          title: 'Unable to log out',
          description: result.error,
        });

      return result;
    },
    { error: undefined },
  );

  return (
    <form action={action}>
      <Button
        type='submit'
        variant='ghost'
        size='icon'
        disabled={pending}
        aria-label={pending ? 'Logging out…' : 'Log out'}
        aria-busy={pending}
        title={pending ? 'Logging out…' : 'Log out'}
      >
        {pending ? (
          <LoaderCircle
            className='animate-spin motion-reduce:animate-none'
            aria-hidden='true'
          />
        ) : (
          <LogOut aria-hidden='true' />
        )}
      </Button>
    </form>
  );
}
