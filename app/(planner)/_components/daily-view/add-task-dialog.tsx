'use client';

import { Plus } from 'lucide-react';
import { useId, useState, type SubmitEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import TimeInput from '@/components/ui/time-input';
import type { TaskCategory } from '@/lib/types';

const durations = Array.from({ length: (4 * 60) / 15 }, (_, index) => {
  const minutes = (index + 1) * 15;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return {
    value: String(minutes),
    label: [hours && `${hours}h`, remainder && `${remainder}m`]
      .filter(Boolean)
      .join(' '),
  };
});

export type TaskDraft = {
  title: string;
  categoryId: string;
  startTime: string;
  durationMinutes: number;
  notes?: string;
};

export function AddTaskDialog({
  categories,
  timezone,
  onAddTask,
}: {
  categories: readonly TaskCategory[];
  timezone: string;
  onAddTask: (task: TaskDraft) => string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const formId = useId();

  const categoryOptions = categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) setError('');
    setOpen(nextOpen);
  }

  function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const title = String(data.get('title') ?? '').trim();
    const categoryId = String(data.get('category') ?? '');
    const startTime = String(data.get('start') ?? '');
    const duration = String(data.get('duration') ?? '');
    const notes = String(data.get('notes') ?? '').trim();

    if (!title) {
      setError('Enter what you want to focus on.');
      return;
    }

    if (
      !categories.some(({ id }) => id === categoryId) ||
      !startTime ||
      !durations.some(({ value }) => value === duration)
    ) {
      setError('Choose a focus area, start time, and duration.');
      return;
    }

    const conflict = onAddTask({
      title,
      categoryId,
      startTime,
      durationMinutes: Number(duration),
      notes: notes || undefined,
    });

    if (conflict) {
      setError(conflict);
      return;
    }

    changeOpen(false);
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={changeOpen}
      title='Add task'
      description='Schedule time for a task today.'

      trigger={
        <Button type='button' variant='outline'>
          <Plus aria-hidden='true' />
          Add task
        </Button>
      }

      footer={
        <>
          <Button
            type='button'
            variant='outline'
            onClick={() => changeOpen(false)}
          >
            Cancel
          </Button>

          <Button type='submit' form={formId}>
            Add task
          </Button>
        </>
      }
    >
      <form id={formId} className='grid gap-5' onSubmit={submitForm}>
        <Field className='gap-2'>
          <FieldLabel htmlFor={`${formId}-title`}>
            What will you focus on?
          </FieldLabel>

          <Input
            id={`${formId}-title`}
            name='title'
            placeholder='e.g. Practice arrays and hash maps'
            maxLength={120}
            required
          />
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor={`${formId}-category`}>Category</FieldLabel>

          <Select
            name='category'
            items={categoryOptions}
            defaultValue={categoryOptions[0]?.value}
            required
          >
            <SelectTrigger
              id={`${formId}-category`}
              size='sm'
              className='border-input dark:bg-input/30 w-full min-w-0 px-3'
            >
              <SelectValue placeholder='Choose a focus area' />
            </SelectTrigger>

            <SelectContent align='start' alignItemWithTrigger={false}>
              {categoryOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className='grid gap-5 sm:grid-cols-2'>
          <Field className='min-w-0 gap-2'>
            <div className='flex flex-wrap items-center justify-between gap-1'>
              <FieldLabel htmlFor={`${formId}-start`}>Start time</FieldLabel>
              <span className='text-muted-foreground text-xs'>{timezone}</span>
            </div>

            <TimeInput id={`${formId}-start`} name='start' required />
          </Field>

          <Field className='min-w-0 gap-2'>
            <FieldLabel htmlFor={`${formId}-duration`}>Duration</FieldLabel>

            <Select
              name='duration'
              items={durations}
              defaultValue='60'
              required
            >
              <SelectTrigger
                id={`${formId}-duration`}
                size='sm'
                className='border-input dark:bg-input/30 w-full min-w-0 px-3'
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent align='start' alignItemWithTrigger={false}>
                {durations.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field className='gap-2'>
          <div className='flex items-center gap-2'>
            <FieldLabel htmlFor={`${formId}-notes`}>
              A note for yourself
            </FieldLabel>

            <span className='text-muted-foreground text-xs'>optional</span>
          </div>

          <Textarea
            id={`${formId}-notes`}
            name='notes'
            maxLength={1000}
            placeholder='A chapter to read, a problem to solve, or one small thing to build…'
            rows={2}
          />
        </Field>

        <FieldError>{error}</FieldError>
      </form>
    </ResponsiveDialog>
  );
}
