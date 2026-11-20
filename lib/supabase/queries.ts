import type { createClient } from '@/lib/supabase/server';
import type { DailyPlanSnapshot, PlannerDefaults } from '@/lib/types';

type DailyPlanRow = Omit<DailyPlanSnapshot, 'startTime' | 'targetMinutes'> & {
  start_time: string;
  target_minutes: number;
};

type PlannerDefaultsRow = {
  timezone: string;
  default_start_time: string;
  target_minutes: number;
  categories: PlannerDefaults['categories'];
};

export async function getPlannerDefaults(
  supabase: ReturnType<typeof createClient>,
) {
  const { data, error } = await supabase
    .schema('daily_focus')
    .rpc('get_planner_defaults')
    .select('timezone, default_start_time, target_minutes, categories')
    .maybeSingle<PlannerDefaultsRow>();

  if (!data) return { data: undefined, error };

  const { default_start_time, target_minutes, ...snapshot } = data;
  const defaults: PlannerDefaults = {
    ...snapshot,
    defaultStartTime: default_start_time,
    targetMinutes: target_minutes,
  };

  return { data: defaults, error };
}

export async function getDailyPlan(
  supabase: ReturnType<typeof createClient>,
  date: string,
) {
  const { data, error } = await supabase
    .schema('daily_focus')
    .rpc('get_daily_plan', { p_date: date })
    .maybeSingle<DailyPlanRow>();

  if (!data) return { data: undefined, error };

  const { start_time, target_minutes, ...snapshot } = data;
  const plan: DailyPlanSnapshot = {
    ...snapshot,
    startTime: start_time,
    targetMinutes: target_minutes,
  };

  return { data: plan, error };
}
