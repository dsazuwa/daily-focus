'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function logout(): Promise<{ error?: string }> {
  try {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.signOut({ scope: 'local' });

    if (error) return { error: 'Unable to log out. Please try again.' };
  } catch {
    return { error: 'Unable to connect. Please try again shortly.' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
