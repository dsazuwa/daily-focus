'use client';

import { Pencil, Plus } from 'lucide-react';
import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react';

import {
  addScheduledTask,
  deleteScheduledTask,
  editScheduledTask,
} from '@/app/actions/schedule';
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
import { focusNextFieldOnEnter } from '@/lib/form-navigation';
import { formatDuration } from '@/lib/time';
import type { Task, TaskCategory } from '@/lib/types';

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

export function TaskDialog({
  categories,
  timezone,
  date,
  task,
}: {
  categories: readonly TaskCategory[];
  timezone: string;
  date: string;
  task?: Task;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [operation, setOperation] = useState<'save' | 'delete'>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const saving = operation !== undefined;
  const dialogTitle = task ? 'Edit task' : 'Add task';
  const submitLabel = task ? 'Save changes' : 'Add task';
  const formId = useId();

  const keepTaskButton = useRef<HTMLButtonElement>(null);
  const deleteTaskButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && confirmDelete) keepTaskButton.current?.focus();
  }, [open, confirmDelete]);

  function keepTask() {
    setError('');
    setConfirmDelete(false);
    requestAnimationFrame(() => deleteTaskButton.current?.focus());
  }

  const categoryOptions = categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const initialDuration = String(task?.durationMinutes ?? 60);
  const durationOptions =
    task && !durations.some(({ value }) => value === initialDuration)
      ? [
          ...durations,
          {
            value: initialDuration,
            label: formatDuration(task.durationMinutes),
          },
        ]
      : durations;

  function changeOpen(nextOpen: boolean) {
    if (saving) return;
    if (nextOpen) {
      setError('');
      setConfirmDelete(false);
      setFormVersion((version) => version + 1);
    }
    setOpen(nextOpen);
  }

  async function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

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
      !durationOptions.some(({ value }) => value === duration)
    ) {
      setError('Choose a focus area, start time, and duration.');
      return;
    }

    setOperation('save');
    setError('');

    try {
      const input = {
        title,
        categoryId,
        startTime,
        durationMinutes: Number(duration),
        notes,
      };
      const error = task
        ? await editScheduledTask(task.id, {
            ...input,
            startTime: startTime === task.startTime ? undefined : startTime,
          })
        : await addScheduledTask({ ...input, date });

      if (error) {
        setError(error);
        return;
      }

      setOpen(false);
    } catch {
      setError(task ? 'Unable to save this task.' : 'Unable to add this task.');
    } finally {
      setOperation(undefined);
    }
  }

  async function deleteTask() {
    if (!task || saving) return;

    setOperation('delete');
    setError('');
    try {
      const error = await deleteScheduledTask(task.id);
      if (error) {
        setError(error);
        return;
      }

      setOpen(false);
    } catch {
      setError('Unable to delete this task.');
    } finally {
      setOperation(undefined);
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={changeOpen}
      title={confirmDelete ? 'Delete task?' : dialogTitle}
      description={
        confirmDelete
          ? `“${task?.title}” will be removed from your schedule.`
          : 'Choose a start time and duration. The task must end by midnight.'
      }

      trigger={
        task ? (
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            aria-label={`Edit ${task.title}`}
            className='text-muted-foreground hover:text-foreground shrink-0'
          >
            <Pencil className='size-3.5 md:size-4.5' aria-hidden='true' />
          </Button>
        ) : (
          <Button type='button' variant='outline'>
            <Plus aria-hidden='true' />
            Add task
          </Button>
        )
      }

      footer={
        confirmDelete ? (
          <>
            <Button
              ref={keepTaskButton}
              type='button'
              variant='outline'
              disabled={saving}
              onClick={keepTask}
            >
              Keep task
            </Button>

            <Button
              type='button'
              variant='destructive'
              disabled={saving}
              onClick={deleteTask}
            >
              {saving ? 'Deleting…' : 'Delete task'}
            </Button>
          </>
        ) : (
          <>
            {task && (
              <Button
                type='button'
                variant='destructive'
                disabled={saving}
                ref={deleteTaskButton}
                onClick={() => {
                  setError('');
                  setConfirmDelete(true);
                }}
              >
                Delete task
              </Button>
            )}

            <Button
              type='button'
              variant='outline'
              disabled={saving}
              onClick={() => changeOpen(false)}
            >
              Cancel
            </Button>

            <Button type='submit' form={formId} disabled={saving}>
              {operation === 'save' ? 'Saving…' : submitLabel}
            </Button>
          </>
        )
      }
    >
      <div hidden={confirmDelete}>
        <form
          key={formVersion}
          id={formId}
          className='grid gap-5'
          inert={saving}
          aria-busy={saving}
          onKeyDown={focusNextFieldOnEnter}
          onSubmit={submitForm}
        >
          <Field className='gap-2'>
            <FieldLabel htmlFor={`${formId}-title`}>
              What will you focus on?
            </FieldLabel>

            <Input
              id={`${formId}-title`}
              name='title'
              placeholder='e.g. Practice arrays and hash maps'
              defaultValue={task?.title}
              maxLength={task ? 200 : 120}
              required
            />
          </Field>

          <Field className='gap-2'>
            <FieldLabel htmlFor={`${formId}-category`}>Category</FieldLabel>

            <Select
              name='category'
              items={categoryOptions}
              defaultValue={task?.category.id ?? categoryOptions[0]?.value}
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
                <span className='text-muted-foreground text-xs'>
                  {timezone}
                </span>
              </div>

              <TimeInput
                id={`${formId}-start`}
                name='start'
                defaultValue={task?.startTime}
                required
              />
            </Field>

            <Field className='min-w-0 gap-2'>
              <FieldLabel htmlFor={`${formId}-duration`}>Duration</FieldLabel>

              <Select
                name='duration'
                items={durationOptions}
                defaultValue={initialDuration}
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
                  {durationOptions.map(({ value, label }) => (
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
              defaultValue={task?.notes}
              maxLength={1000}
              placeholder='A chapter to read, a problem to solve, or one small thing to build…'
              rows={2}
            />
          </Field>

          <FieldError>{error}</FieldError>
        </form>
      </div>

      {confirmDelete && <FieldError>{error}</FieldError>}
    </ResponsiveDialog>
  );
}
