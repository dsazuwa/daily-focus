import type { DailyPlan, PlannerDefaults, TaskCategory } from './types';

export type CategorySummary = {
  category: TaskCategory;
  allocatedMinutes: number;
  plannedMinutes: number;
};

export type DailySummaryData = {
  rows: CategorySummary[];
  plannedMinutes: number;
  completedTasks: number;
  targetMinutes: number | undefined;
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
  let completedTasks = 0;

  for (const task of plan.tasks) {
    if (task.date !== plan.date) continue;

    const planned = task.status === 'skipped' ? 0 : task.durationMinutes;
    plannedMinutes += planned;
    if (task.status === 'completed') completedTasks += 1;

    const row = rowsById.get(task.categoryId);
    if (row) {
      row.plannedMinutes += planned;
    }
  }

  const targetMinutes = plan.targetMinutes ?? 0;

  return {
    rows,
    plannedMinutes,
    completedTasks,
    targetMinutes: plan.targetMinutes,
    progressPercentage:
      targetMinutes > 0
        ? Math.min(
            100,
            Math.max(0, Math.round((plannedMinutes / targetMinutes) * 100)),
          )
        : 0,
  };
}
