import type { DailyPlan, PlannerDefaults, TaskCategory } from './types';

export type CategorySummary = {
  category: TaskCategory;
  allocatedMinutes: number;
  plannedMinutes: number;
  completedMinutes: number;
};

export type DailySummaryData = {
  rows: CategorySummary[];
  plannedMinutes: number;
  completedMinutes: number;
  targetMinutes: number | undefined;
  remainingMinutes: number;
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
    completedMinutes: 0,
  }));
  const rowsById = new Map(rows.map((row) => [row.category.id, row]));
  let plannedMinutes = 0;
  let completedMinutes = 0;

  for (const task of plan.tasks) {
    if (task.date !== plan.date) continue;

    // Skipping removes planned time, but preserves any time already logged.
    const planned = task.status === 'skipped' ? 0 : task.durationMinutes;
    plannedMinutes += planned;
    completedMinutes += task.actualMinutes;

    const row = rowsById.get(task.categoryId);
    if (row) {
      row.plannedMinutes += planned;
      row.completedMinutes += task.actualMinutes;
    }
  }

  const targetMinutes = plan.targetMinutes ?? 0;

  return {
    rows,
    plannedMinutes,
    completedMinutes,
    targetMinutes: plan.targetMinutes,
    remainingMinutes: Math.max(0, targetMinutes - completedMinutes),
    progressPercentage:
      targetMinutes > 0
        ? Math.min(
            100,
            Math.max(0, Math.round((completedMinutes / targetMinutes) * 100)),
          )
        : 0,
  };
}
