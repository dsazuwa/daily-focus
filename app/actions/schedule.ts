'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';

import { isDateKey } from '@/lib/dates';
import { createClient } from '@/lib/supabase/server';

type TaskInput = {
  title: string;
  categoryId: string;
  startTime: string;
  durationMinutes: number;
  notes: string;
};

function isStartTime(value: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

async function getScheduleSession() {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return;
  return { supabase, userId: data.user.id };
}

function getScheduleError(code: string, fallback: string) {
  if (code === '23P01') return 'That time overlaps another scheduled task.';
  if (code === 'P2201')
    return 'This task ends after midnight. Choose an earlier start or a shorter duration.';
  if (code === '22007')
    return 'That start time does not exist on this day. Choose a different time.';
  return fallback;
}

export async function addScheduledTask(input: TaskInput & { date: string }) {
  if (!isDateKey(input.date) || !isStartTime(input.startTime)) {
    return 'Choose a valid date and start time.';
  }

  const session = await getScheduleSession();
  if (!session) return 'Unable to verify your session.';

  const { error } = await session.supabase
    .schema('daily_focus')
    .rpc('add_scheduled_task', {
      p_date: input.date,
      p_category_id: input.categoryId,
      p_title: input.title,
      p_notes: input.notes,
      p_start_time: input.startTime,
      p_duration_minutes: input.durationMinutes,
    });

  if (error?.code === 'P0002')
    return 'Set up your planner before adding tasks.';
  if (error) return getScheduleError(error.code, 'Unable to add this task.');

  refresh();
}

export async function editScheduledTask(
  id: string,
  input: Omit<TaskInput, 'startTime'> & { startTime?: string },
) {
  if (input.startTime !== undefined && !isStartTime(input.startTime))
    return 'Choose a valid start time.';

  const session = await getScheduleSession();
  if (!session) return 'Unable to verify your session.';

  const { data, error } = await session.supabase
    .schema('daily_focus')
    .from('schedule_blocks')
    .update({
      category_id: input.categoryId,
      title: input.title,
      notes: input.notes,
      ...(input.startTime === undefined ? {} : { start_time: input.startTime }),
      duration_minutes: input.durationMinutes,
    })
    .eq('id', id)
    .eq('owner_id', session.userId)
    .select('id')
    .maybeSingle();

  if (error) return getScheduleError(error.code, 'Unable to save this task.');
  if (!data) return 'This task is no longer available.';

  refresh();
}

export async function setScheduledTaskCompleted(
  id: string,
  completed: boolean,
) {
  const session = await getScheduleSession();
  if (!session) return 'Unable to verify your session.';

  const { data, error } = await session.supabase
    .schema('daily_focus')
    .from('schedule_blocks')
    .update({ status: completed ? 'completed' : 'planned' })
    .eq('id', id)
    .eq('owner_id', session.userId)
    .select('id')
    .maybeSingle();

  if (error) return 'Unable to update task completion.';
  if (!data) return 'This task is no longer available.';

  refresh();
}

export async function deleteScheduledTask(id: string) {
  const session = await getScheduleSession();
  if (!session) return 'Unable to verify your session.';

  const { error } = await session.supabase
    .schema('daily_focus')
    .from('schedule_blocks')
    .delete()
    .eq('id', id)
    .eq('owner_id', session.userId);

  if (error) return 'Unable to delete this task.';

  refresh();
}
