import { categories, dailyPlan, tasks } from '@/lib/mock';
import { ScheduleBlock, Task, TaskCategory } from '@/lib/types';
import BreakRow from './break-row';
import DailySummary from './daily-summary';
import MotivationCard from './motivation-card';
import TaskCard from './task-card';

export default function DailyContent() {
  // TODO: Remove when we have a real backend
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const sortedBlocks = [...dailyPlan.blocks].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  return (
    <div className='gap-uniform grid md:grid-cols-12'>
      <div className='space-y-3 md:col-span-7'>
        {sortedBlocks.length === 0 ? (
          <p className='text-muted-foreground py-8 text-center text-sm'>
            No blocks scheduled for this day.
          </p>
        ) : (
          sortedBlocks.map((block) => (
            <PlanBlockItem
              key={block.id}
              block={block}
              taskMap={taskMap}
              categoryMap={categoryMap}
            />
          ))
        )}
      </div>

      <div className='space-y-uniform md:col-span-5'>
        <DailySummary plan={dailyPlan} tasks={tasks} categories={categories} />

        <MotivationCard />
      </div>
    </div>
  );
}

function PlanBlockItem({
  block,
  taskMap,
  categoryMap,
}: {
  block: ScheduleBlock;
  taskMap: Map<string, Task>;
  categoryMap: Map<string, TaskCategory>;
}) {
  if (block.type === 'break') return <BreakRow block={block} />;

  const task = block.taskId ? taskMap.get(block.taskId) : undefined;
  const category = task ? categoryMap.get(task.categoryId) : undefined;

  if (!task || !category)
    return (
      <p className='text-destructive text-sm'>
        Missing task or category for block {block.id}.
      </p>
    );

  return <TaskCard task={task} block={block} category={category} />;
}
