import type { createClient } from '@/lib/supabase/server';
import type {
  DailyPlanSnapshot,
  PlannerDefaults,
  PlanSummaryByMonth,
  Task,
} from '@/lib/types';

type CalendarDaySummaryRow = {
  date: string;
  target_minutes: number;
  planned_minutes: number;
};

type PlanSummaryByMonthRow = {
  days_planned: number;
  targets_planned: number;
  planned_minutes: number;
  days: CalendarDaySummaryRow[];
};

type ScheduledTaskRow = {
  id: string;
  title: string;
  notes: string;
  category: Task['category'];
  start_time: string;
  end_time: string;
  start_offset_minutes: number;
  duration_minutes: number;
  status: Task['status'];
};

type DailyScheduleRow = {
  plan:
    | (Omit<DailyPlanSnapshot, 'targetMinutes'> & { target_minutes: number })
    | null;
  tasks: ScheduledTaskRow[];
};

type PlannerDefaultsRow = {
  timezone: string;
  target_minutes: number;
  categories: PlannerDefaults['categories'];
};

export async function getPlannerDefaults(
  supabase: ReturnType<typeof createClient>,
) {
  const { data, error } = await supabase
    .schema('daily_focus')
    .rpc('get_planner_defaults')
    .select('timezone, target_minutes, categories')
    .maybeSingle<PlannerDefaultsRow>();

  if (!data) return { data: undefined, error };

  const { target_minutes, ...snapshot } = data;
  const defaults: PlannerDefaults = {
    ...snapshot,
    targetMinutes: target_minutes,
  };

  return { data: defaults, error: undefined };
}

export function changePlannerDefaults(
  supabase: ReturnType<typeof createClient>,
  defaults: PlannerDefaults,
) {
  return supabase.schema('daily_focus').rpc('change_planner_defaults', {
    p_timezone: defaults.timezone,
    p_target_minutes: defaults.targetMinutes,
    p_categories: defaults.categories,
  });
}

export async function getDailySchedule(
  supabase: ReturnType<typeof createClient>,
  date: string,
) {
  const { data, error } = await supabase
    .schema('daily_focus')
    .rpc('get_daily_schedule', { p_date: date })
    .maybeSingle<DailyScheduleRow>();

  if (error) return { error: "Unable to load this day's schedule." };
  if (!data) return { data: undefined };

  const plan = data.plan
    ? {
        id: data.plan.id,
        date: data.plan.date,
        timezone: data.plan.timezone,
        categories: data.plan.categories,
        targetMinutes: data.plan.target_minutes,
      }
    : undefined;

  const tasks: Task[] = data.tasks.map((row) => ({
    id: row.id,
    title: row.title,
    startTime: row.start_time,
    endTime: row.end_time,
    startOffsetMinutes: row.start_offset_minutes,
    durationMinutes: row.duration_minutes,
    status: row.status,
    category: row.category,
    notes: row.notes,
  }));

  return { data: { plan, tasks } };
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
    targetsPlanned: data.targets_planned,
    plannedMinutes: data.planned_minutes,
    daySummaries: data.days.map((day) => ({
      date: day.date,
      targetMinutes: day.target_minutes,
      plannedMinutes: day.planned_minutes,
    })),
  };

  return { data: summary, error: undefined };
}
