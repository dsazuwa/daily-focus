'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';

import { isDateKey } from '@/lib/dates';
import { createClient } from '@/lib/supabase/server';

export async function addScheduledTask(input: {
  date: string;
  title: string;
  categoryId: string;
  startTime: string;
  durationMinutes: number;
  notes: string;
}) {
  if (
    !isDateKey(input.date) ||
    !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(input.startTime)
  ) {
    return 'Choose a valid date and start time.';
  }

  const supabase = createClient(await cookies());
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) return 'Unable to verify your session.';

  const { error } = await supabase
    .schema('daily_focus')
    .rpc('add_scheduled_task', {
      p_date: input.date,
      p_category_id: input.categoryId,
      p_title: input.title,
      p_notes: input.notes,
      p_start_time: input.startTime,
      p_duration_minutes: input.durationMinutes,
    });

  if (error?.code === '23P01')
    return 'That time overlaps another scheduled task.';
  if (error?.code === 'P2201')
    return 'This task ends after midnight. Choose an earlier start or a shorter duration.';
  if (error?.code === '22007')
    return 'That start time does not exist on this day. Choose a different time.';
  if (error?.code === 'P0002')
    return 'Set up your planner before adding tasks.';
  if (error) return 'Unable to add this task.';

  refresh();
}
