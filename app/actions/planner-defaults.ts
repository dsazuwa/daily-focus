'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';

import {
  changePlannerDefaults,
  getPlannerDefaults,
} from '@/lib/supabase/queries';
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

export async function changePlannerDefaultsAction(
  defaults: PlannerDefaults,
): Promise<{ error?: string }> {
  const supabase = createClient(await cookies());
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user)
    return { error: 'Unable to verify your session.' };

  const { error } = await changePlannerDefaults(supabase, defaults);

  if (error) return { error: 'Unable to save planner defaults.' };

  refresh();

  return {};
}
