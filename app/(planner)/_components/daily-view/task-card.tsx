'use client';

import { useState, type CSSProperties } from 'react';

import ArrowRight from 'lucide-react/icons/arrow-right';

import { setScheduledTaskCompleted } from '@/app/actions/schedule';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Task, TaskCategory } from '@/lib/types';
import { formatDuration } from '@/lib/time';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '../category-icon';
import { TaskDialog } from './task-dialog';

type TaskCardProps = {
  task: Task;
  categories: TaskCategory[];
  date: string;
  timezone?: string;
};

export default function TaskCard({
  task,
  categories,
  timezone,
  date,
}: TaskCardProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { category } = task;
  const isCompleted = task.status === 'completed';
  const duration = formatDuration(task.durationMinutes);

  async function changeCompletion(completed: boolean) {
    if (saving) return;

    setSaving(true);
    setError('');
    try {
      const error = await setScheduledTaskCompleted(task.id, completed);
      if (error) setError(error);
    } catch {
      setError('Unable to update task completion.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card
      size='sm'
      style={
        { '--task-color': `var(--task-${category.color})` } as CSSProperties
      }
      className={cn(
        'relative transition-opacity',
        'before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-r before:bg-(--task-color) before:content-[""]',
        isCompleted && 'opacity-60',
      )}
    >
      <CardContent className='flex items-center gap-3 sm:gap-4'>
        <Checkbox
          aria-label={`Completed: ${task.title}`}
          disabled={saving}
          checked={isCompleted}
          onCheckedChange={changeCompletion}
          className='enabled:hover:border-primary enabled:hover:ring-primary/25 mt-1 size-3.5 rounded-full enabled:cursor-pointer enabled:hover:ring-2 sm:mt-0 md:size-4.5'
        />

        <div className='min-w-0 flex-1 space-y-1.5'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge
              variant='secondary'
              className='text-xxs gap-1 uppercase'
              style={{ color: `var(--task-${category.color})` }}
            >
              <CategoryIcon
                name={category.icon}
                className='size-3'
                aria-hidden='true'
              />
              {category.name}
            </Badge>

            <span className='text-muted-foreground text-xs tabular-nums'>
              {duration}
            </span>
          </div>

          <h3
            className={cn(
              'truncate text-sm font-medium sm:text-base',
              isCompleted && 'line-through',
            )}
          >
            {task.title}
          </h3>

          <div className='text-muted-foreground flex items-center gap-1.5 text-xs tabular-nums'>
            <span>{task.startTime}</span>
            <ArrowRight className='size-3 shrink-0' aria-hidden='true' />
            <span>{task.endTime}</span>
            {timezone && (
              <span className='text-xxs font-medium uppercase'>{timezone}</span>
            )}
          </div>
        </div>

        {timezone && (
          <TaskDialog
            task={task}
            categories={categories}
            timezone={timezone}
            date={date}
          />
        )}
      </CardContent>

      {error && (
        <CardContent>
          <p role='alert' className='text-destructive text-sm'>
            {error}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
