import type {
  BreakBlock,
  DailyPlan,
  Task,
  TaskBlock,
  TaskCategory,
} from './types';

export const categories: TaskCategory[] = [
  { id: 'study', name: 'Study', color: 'sage', icon: 'book-open' },
  { id: 'interview', name: 'Interview coding', color: 'sky', icon: 'code-xml' },
  { id: 'project', name: 'Project coding', color: 'sand', icon: 'folder-code' },
];

function createTask(
  id: string,
  categoryId: string,
  title: string,
  estimatedMinutes: number,
): Task {
  return {
    id,
    categoryId,
    title,
    estimatedMinutes,
    status: 'todo',
    createdAt: '2026-11-16T07:00:00Z',
  };
}

export const tasks: Task[] = [
  createTask('task-1', 'study', 'Java & Spring foundations', 90),
  createTask('task-2', 'study', 'Read, recall, take notes', 90),
  createTask('task-3', 'interview', 'Solve & review', 90),
  createTask('task-4', 'interview', 'Practice problem patterns', 90),
  createTask('task-5', 'project', 'Build Farm Desk', 120),
];

const date = '2026-11-16';

function taskBlock(
  id: string,
  taskId: string,
  startTime: string,
  durationMinutes: number,
): TaskBlock {
  return {
    id,
    type: 'task',
    taskId,
    date,
    startTime,
    durationMinutes,
    status: 'planned',
    actualMinutes: 0,
  };
}

function breakBlock(
  id: string,
  startTime: string,
  durationMinutes: number,
): BreakBlock {
  return {
    id,
    type: 'break',
    title: 'Break',
    date,
    startTime,
    durationMinutes,
    status: 'planned',
  };
}

export const dailyPlan: DailyPlan = {
  date,
  targetMinutes: 480,
  blocks: [
    taskBlock('block-1', 'task-1', '08:00', 90),
    breakBlock('break-1', '09:30', 15),
    taskBlock('block-2', 'task-2', '09:45', 90),
    breakBlock('break-2', '11:15', 45),
    taskBlock('block-3', 'task-3', '12:00', 90),
    breakBlock('break-3', '13:30', 15),
    taskBlock('block-4', 'task-4', '13:45', 90),
    breakBlock('break-4', '15:15', 15),
    taskBlock('block-5', 'task-5', '15:30', 120),
  ],
};
