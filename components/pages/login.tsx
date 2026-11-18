'use client';

import { useActionState } from 'react';
import { ArrowUpRight, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginWithPassword } from '@/app/actions/login';

export default function LoginPage() {
  const [state, login, pending] = useActionState(loginWithPassword, {
    error: undefined,
  });

  return (
    <main className='bg-background flex flex-1 items-center justify-center px-6 py-12'>
      <div className='flex w-full max-w-sm flex-col items-center text-center'>
        <div className='text-primary-foreground bg-primary mb-6 grid size-14 place-items-center rounded-2xl'>
          <Sun className='size-8' aria-hidden='true' />
        </div>

        <h1 className='text-foreground text-4xl font-bold tracking-tight'>
          daily<span className='font-normal'>focus</span>.
        </h1>

        <p className='text-muted-foreground mt-4 text-base leading-relaxed'>
          Welcome back, Danielle.
          <br />
          Log in to plan your day and pick up where you left off.
        </p>

        <form
          action={login}
          className='mt-8 w-full space-y-4 text-left'
          aria-label='Log in'
        >
          <Field>
            <FieldLabel htmlFor='password'>Password</FieldLabel>

            <Input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              disabled={pending}
            />
          </Field>

          {state.error && (
            <p role='alert' className='text-destructive text-sm'>
              {state.error}
            </p>
          )}

          <Button type='submit' disabled={pending} className='w-full'>
            {pending ? 'Logging in…' : 'Log in'}
            <ArrowUpRight className='size-4' aria-hidden='true' />
          </Button>
        </form>

        <p className='text-muted-foreground mt-5 text-xs'>
          Your private space for a focused day.
        </p>
      </div>
    </main>
  );
}
