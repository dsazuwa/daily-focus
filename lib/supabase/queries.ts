import type { createClient } from '@/lib/supabase/server';
import type {
  DailyPlanSnapshot,
  PlannerDefaults,
  PlanSummaryByMonth,
} from '@/lib/types';

type CalendarDaySummaryRow = {
  date: string;
  target_minutes: number;
  planned_minutes: number;
  completed_minutes: number;
};

type PlanSummaryByMonthRow = {
  days_planned: number;
  goals_met: number;
  planned_minutes: number;
  completed_minutes: number;
  days: CalendarDaySummaryRow[];
};

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

  return { data: defaults, error: undefined };
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

  return { data: plan, error: undefined };
}

export async function getPlanSummaryByMonth(
  supabase: ReturnType<typeof createClient>,
  month: string,
) {
  const { data, error } = await supabase
    .schema('daily_focus')
    .rpc('get_plan_summary_by_month', { p_month: `${month}-01` })
    .single<PlanSummaryByMonthRow>();

  if (error) return { data: undefined, error };

  const summary: PlanSummaryByMonth = {
    daysPlanned: data.days_planned,
    goalsMet: data.goals_met,
    plannedMinutes: data.planned_minutes,
    completedMinutes: data.completed_minutes,
    days: data.days.map((day) => ({
      date: day.date,
      targetMinutes: day.target_minutes,
      plannedMinutes: day.planned_minutes,
      completedMinutes: day.completed_minutes,
    })),
  };

  return { data: summary, error: undefined };
}
