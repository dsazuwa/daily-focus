import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { DailySummaryData } from '@/lib/daily-summary';
import { PLANNER_TIME_ZONE } from '@/lib/dates';
import type { DailyPlan, ScheduleBlock, TaskCategory } from '@/lib/types';
import { usePlannerDefaultsDialog } from '../planner-defaults-provider';
import { AddBlockDialog, type BlockDraft } from './add-block-dialog';
import BreakRow from './break-row';
import DailySummary from './daily-summary';
import MotivationCard from './motivation-card';
import TaskCard from './task-card';

type DailyContentProps = {
  plan: DailyPlan;
  summary: DailySummaryData;
  needsSetup: boolean;
  categories: TaskCategory[];
  timezone?: string;
  defaultStartTime?: string;
  onAddBlock: (block: BlockDraft) => void;
};

export default function DailyContent({
  plan,
  categories,
  summary,
  needsSetup,
  timezone = PLANNER_TIME_ZONE,
  defaultStartTime,
  onAddBlock,
}: DailyContentProps) {
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const sortedBlocks = plan.blocks
    .filter((block) => block.date === plan.date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className='gap-uniform grid md:grid-cols-12'>
      <div className='space-y-3 md:col-span-7'>
        <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
          <div className='space-y-1'>
            <h2 className='text-section-title'>Your schedule</h2>

            <p className='text-section-description'>
              Breaks don&apos;t count toward your goal
            </p>
          </div>

          {categories.length > 0 && (
            <AddBlockDialog
              key={plan.date}
              categories={categories}
              timezone={timezone}
              defaultStartTime={defaultStartTime}
              onAddBlock={onAddBlock}
            />
          )}
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
              timezone={timezone}
              categoryMap={categoryMap}
            />
          ))
        )}
      </div>

      <div className='space-y-uniform md:col-span-5'>
        {needsSetup ? (
          <PlannerSetupCard />
        ) : (
          <DailySummary
            key={plan.date}
            summary={summary}
            startTime={defaultStartTime}
            timezone={timezone}
          />
        )}

        <MotivationCard />
      </div>
    </div>
  );
}

function PlannerSetupCard() {
  const { setDialogOpen } = usePlannerDefaultsDialog();

  return (
    <Card className='gap-uniform'>
      <CardHeader className='text-section-title'>
        Looks like you&apos;re new here
      </CardHeader>

      <CardContent>
        <Button
          type='button'
          className='w-full'
          onClick={() => setDialogOpen(true)}
        >
          Set up your planner
        </Button>
      </CardContent>
    </Card>
  );
}

function PlanBlockItem({
  block,
  timezone,
  categoryMap,
}: {
  block: ScheduleBlock;
  timezone: string;
  categoryMap: Map<string, TaskCategory>;
}) {
  if (block.type === 'break') return <BreakRow block={block} />;

  const category = categoryMap.get(block.categoryId);

  if (!category)
    return (
      <p className='text-destructive text-sm'>
        Missing category for block {block.id}.
      </p>
    );

  return <TaskCard block={block} category={category} timezone={timezone} />;
}
