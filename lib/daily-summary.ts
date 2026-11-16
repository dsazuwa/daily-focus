import type { DailyPlan, Task, TaskCategory } from './types';

export type CategorySummary = {
  category: TaskCategory;
  plannedMinutes: number;
  completedMinutes: number;
};

export type DailySummaryData = {
  rows: CategorySummary[];
  plannedMinutes: number;
  completedMinutes: number;
  targetMinutes: number;
  remainingMinutes: number;
  progressPercentage: number;
};

export function getDailySummary(
  plan: DailyPlan,
  tasks: readonly Task[],
  categories: readonly TaskCategory[],
): DailySummaryData {
  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  const rows: CategorySummary[] = categories.map((category) => ({
    category,
    plannedMinutes: 0,
    completedMinutes: 0,
  }));
  const rowsById = new Map(rows.map((row) => [row.category.id, row]));
  let plannedMinutes = 0;
  let completedMinutes = 0;

  for (const block of plan.blocks) {
    if (block.type !== 'task' || block.date !== plan.date) continue;

    // Skipping removes planned time, but preserves any time already logged.
    const planned = block.status === 'skipped' ? 0 : block.durationMinutes;
    plannedMinutes += planned;
    completedMinutes += block.actualMinutes;

    const task = tasksById.get(block.taskId);
    const row = task ? rowsById.get(task.categoryId) : undefined;
    if (row) {
      row.plannedMinutes += planned;
      row.completedMinutes += block.actualMinutes;
    }
  }

  return {
    rows,
    plannedMinutes,
    completedMinutes,
    targetMinutes: plan.targetMinutes,
    remainingMinutes: Math.max(0, plan.targetMinutes - completedMinutes),
    progressPercentage:
      plan.targetMinutes > 0
        ? Math.min(100, Math.max(0, Math.round((completedMinutes / plan.targetMinutes) * 100)))
        : 0,
  };
}
