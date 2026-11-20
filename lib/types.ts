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
  defaultStartTime: string;
  targetMinutes: number;
  categories: Array<TaskCategory & { minutes: number }>;
};

export type DailyPlanSnapshot = {
  id: string;
  date: string;
  timezone: string;
  startTime: string;
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
  days: CalendarDaySummary[];
};

export type Task = {
  id: string;
  categoryId: TaskCategory['id'];
  title: string;
  notes?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  estimatedMinutes: number;
  createdAt: string; // ISO timestamp
  completedAt?: string;
};

type BlockBase = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm, in the planner's timezone
  durationMinutes: number;
};

export type TaskBlock = BlockBase & {
  type: 'task';
  taskId: Task['id'];
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  actualMinutes: number;
};

export type BreakBlock = BlockBase & {
  type: 'break';
  title: string;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
};

export type ScheduleBlock = TaskBlock | BreakBlock;

export type DailyPlan = {
  date: string; // YYYY-MM-DD
  targetMinutes: number; // 480 for an eight-hour target
  blocks: ScheduleBlock[];
};

export type TaskScheduleChange = {
  id: string;
  taskId: Task['id'];
  blockId: TaskBlock['id'];
  action: 'postponed' | 'rescheduled';
  previousDate: string;
  previousStartTime: string;
  newDate: string;
  newStartTime: string;
  reason?: string;
  changedAt: string; // ISO timestamp
};
