'use server';

import { cookies } from 'next/headers';

import { getPlannerDefaults } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import type { PlannerDefaults } from '@/lib/types';

export async function getPlannerDefaultsAction(): Promise<
  { data: PlannerDefaults | undefined; error?: never } | { error: string }
> {
  const supabase = createClient(await cookies());
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user)
    return { error: 'Unable to verify your session.' };

  const { data, error } = await getPlannerDefaults(supabase);

  if (error) return { error: 'Unable to load planner defaults.' };

  return { data };
}
