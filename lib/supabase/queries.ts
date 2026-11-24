import type { createClient } from '@/lib/supabase/server';
import type {
  DailyPlanSnapshot,
  PlannerDefaults,
  PlanSummaryByMonth,
  ScheduleBlock,
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

type ScheduleBlockRow = {
  id: string;
  type: ScheduleBlock['type'];
  title: string;
  notes: string;
  category_id: string | null;
  task_id: string | null;
  start_time: string;
  duration_minutes: number;
  actual_minutes: number;
  status: ScheduleBlock['status'];
};

type DailyScheduleRow = Omit<DailyPlanSnapshot, 'targetMinutes'> & {
  target_minutes: number;
  blocks: ScheduleBlockRow[];
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

  const { target_minutes, blocks: blockRows, ...snapshot } = data;
  const plan: DailyPlanSnapshot = {
    ...snapshot,
    targetMinutes: target_minutes,
  };

  const blocks: ScheduleBlock[] = [];
  for (const row of blockRows) {
    const block = {
      id: row.id,
      date: plan.date,
      title: row.title,
      startTime: row.start_time.slice(0, 5),
      durationMinutes: row.duration_minutes,
      status: row.status,
    };

    if (row.type === 'break') {
      blocks.push({ ...block, type: 'break' });
    } else {
      if (!row.category_id)
        return { error: "Unable to load this day's schedule." };
      blocks.push({
        ...block,
        type: 'task',
        categoryId: row.category_id,
        taskId: row.task_id ?? undefined,
        notes: row.notes,
        actualMinutes: row.actual_minutes,
      });
    }
  }

  return { data: { plan, blocks } };
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
    daySummaries: data.days.map((day) => ({
      date: day.date,
      targetMinutes: day.target_minutes,
      plannedMinutes: day.planned_minutes,
      completedMinutes: day.completed_minutes,
    })),
  };

  return { data: summary, error: undefined };
}
