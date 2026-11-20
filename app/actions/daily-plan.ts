'use server';

import { cookies } from 'next/headers';

import { isDateKey } from '@/lib/dates';
import { getDailyPlan } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import type { DailyPlanSnapshot } from '@/lib/types';

export async function getDailyPlanAction(
  date: string,
): Promise<
  { data: DailyPlanSnapshot | undefined; error?: never } | { error: string }
> {
  if (!isDateKey(date))
    return { error: 'Enter a valid date in YYYY-MM-DD format.' };

  const supabase = createClient(await cookies());
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user)
    return { error: 'Unable to verify your session.' };

  const { data, error } = await getDailyPlan(supabase, date);

  if (error) return { error: 'Unable to load the daily plan.' };

  return { data };
}
