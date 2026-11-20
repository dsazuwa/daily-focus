'use server';

import { cookies } from 'next/headers';

import { getPlanSummaryByMonth } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import type { PlanSummaryByMonth } from '@/lib/types';

export async function getPlanSummaryByMonthAction(
  month: string,
): Promise<{ data: PlanSummaryByMonth; error?: never } | { error: string }> {
  if (
    typeof month !== 'string' ||
    month.length !== 7 ||
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
    month.startsWith('0000-')
  )
    return { error: 'Enter a valid month in YYYY-MM format.' };

  const supabase = createClient(await cookies());
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user)
    return { error: 'Unable to verify your session.' };

  const { data, error } = await getPlanSummaryByMonth(supabase, month);

  if (error) return { error: 'Unable to load the monthly plan summary.' };

  return { data };
}
