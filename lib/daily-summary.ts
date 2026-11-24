import type { DailyPlan, PlannerDefaults, TaskCategory } from './types';

export type CategorySummary = {
  category: TaskCategory;
  allocatedMinutes: number;
  plannedMinutes: number;
};

export type DailySummaryData = {
  rows: CategorySummary[];
  plannedMinutes: number;
  completedMinutes: number;
  targetMinutes: number | undefined;
  remainingMinutes: number | undefined;
  progressPercentage: number;
};

export function getDailySummary(
  plan: DailyPlan,
  categories: PlannerDefaults['categories'],
): DailySummaryData {
  const rows: CategorySummary[] = categories.map((category) => ({
    category,
    allocatedMinutes: category.minutes,
    plannedMinutes: 0,
  }));
  const rowsById = new Map(rows.map((row) => [row.category.id, row]));
  let plannedMinutes = 0;
  let completedMinutes = 0;

  for (const task of plan.tasks) {
    const planned = task.status === 'skipped' ? 0 : task.durationMinutes;
    plannedMinutes += planned;
    if (task.status === 'completed') completedMinutes += task.durationMinutes;

    const row = rowsById.get(task.category.id);
    if (row) {
      row.plannedMinutes += planned;
    }
  }

  const targetMinutes = plan.targetMinutes ?? 0;

  return {
    rows,
    plannedMinutes,
    completedMinutes,
    targetMinutes: plan.targetMinutes,
    remainingMinutes:
      plan.targetMinutes === undefined
        ? undefined
        : Math.max(0, targetMinutes - completedMinutes),
    progressPercentage:
      targetMinutes > 0
        ? Math.min(
            100,
            Math.max(0, Math.round((completedMinutes / targetMinutes) * 100)),
          )
        : 0,
  };
}
