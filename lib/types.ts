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
  targetsMet: number;
  completedMinutes: number;
  daySummaries: CalendarDaySummary[];
};

export type Task = {
  id: string;
  startTime: string;
  endTime: string;
  startOffsetMinutes: number;
  durationMinutes: number;
  category: TaskCategory;
  title: string;
  notes?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
};

export type DailyPlan = {
  date: string; // YYYY-MM-DD
  targetMinutes: number | undefined;
  tasks: Task[];
};
