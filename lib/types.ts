export type TaskColor =
  | 'sage'
  | 'sky'
  | 'sand'
  | 'lavender'
  | 'rose'
  | 'teal'
  | 'peach'
  | 'indigo'
  | 'amber'
  | 'slate';

export type TaskCategory = {
  id: string;
  name: string;
  color: TaskColor;
  icon: string; // Lucide icon name saved with the category
};

export type PlannerDefaults = {
  timezone: string;
  targetMinutes: number;
  categories: Array<TaskCategory & { minutes: number }>;
};

export type DailyPlanSnapshot = {
  id: string;
  date: string;
  timezone: string;
  targetMinutes: number;
  categories: PlannerDefaults['categories'];
};

export type CalendarDaySummary = {
  date: string;
  targetMinutes: number;
  plannedMinutes: number;
  completedMinutes: number;
};

export type PlanSummaryByMonth = {
  daysPlanned: number;
  goalsMet: number;
  plannedMinutes: number;
  completedMinutes: number;
  daySummaries: CalendarDaySummary[];
};

type BlockBase = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm, in the planner's timezone
  durationMinutes: number;
};

export type Task = BlockBase & {
  type: 'task';
  taskId?: string;
  categoryId: TaskCategory['id'];
  title: string;
  notes?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  actualMinutes: number;
};

export type BreakBlock = BlockBase & {
  type: 'break';
  title: string;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
};

export type ScheduleBlock = Task | BreakBlock;

export type DailyPlan = {
  date: string; // YYYY-MM-DD
  targetMinutes: number | undefined;
  blocks: ScheduleBlock[];
};
