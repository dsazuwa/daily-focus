'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function loginWithPassword(
  _previousState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const password = formData.get('password');
  const email = process.env.DAILY_FOCUS_LOGIN_EMAIL;

  if (!email) 
    return { error: 'Login is not configured yet.' };

  if (typeof password !== 'string' || !password) 
    return { error: 'Enter your password.' };

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) 
      return { error: 'Unable to log in. Check your password and try again.' };
  } catch (error) {
    console.error('Unexpected login error:', error);
    return { error: 'Unable to connect. Please try again shortly.' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}