import type { DailySummaryData } from '@/lib/daily-summary';
import { PLANNER_TIME_ZONE } from '@/lib/dates';
import type { DailyPlan, ScheduleBlock, Task, TaskCategory } from '@/lib/types';
import { AddBlockDialog, type BlockDraft } from './add-block-dialog';
import BreakRow from './break-row';
import DailySummary from './daily-summary';
import MotivationCard from './motivation-card';
import TaskCard from './task-card';

type DailyContentProps = {
  plan: DailyPlan;
  summary: DailySummaryData;
  tasks: Task[];
  categories: TaskCategory[];
  onAddBlock: (block: BlockDraft) => void;
};

export default function DailyContent({
  plan,
  tasks,
  categories,
  summary,
  onAddBlock,
}: DailyContentProps) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const sortedBlocks = plan.blocks
    .filter((block) => block.date === plan.date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className='gap-uniform grid md:grid-cols-12'>
      <div className='space-y-3 md:col-span-7'>
        <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
          <div className='space-y-1'>
            <h2 className='font-heading tracking-tight'>Your schedule</h2>

            <p className='text-muted-foreground text-xs'>
              Breaks don&apos;t count toward your goal
            </p>
          </div>

          <AddBlockDialog
            key={plan.date}
            categories={categories}
            timezone={PLANNER_TIME_ZONE}
            onAddBlock={onAddBlock}
          />
        </div>

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
        <DailySummary
          key={plan.date}
          summary={summary}
          startTime={sortedBlocks[0]?.startTime}
        />

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
