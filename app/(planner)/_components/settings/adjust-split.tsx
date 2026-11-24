'use client';

import { ArrowRight, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { useId, useState, type SubmitEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { Separator } from '@/components/ui/separator';
import TimeInput from '@/components/ui/time-input';
import type { DailySummaryData } from '@/lib/daily-summary';
import { PLANNER_TIME_ZONE } from '@/lib/dates';
import { CategoryIcon } from '../category-icon';
import { usePlannerDefaults } from '../planner-defaults-provider';
import { TotalAllocation } from './total-allocation';

export default function AdjustSplitDialog({
  summary,
  initialStartTime = '08:00',
  timezone = PLANNER_TIME_ZONE,
}: {
  summary: DailySummaryData;
  initialStartTime?: string;
  timezone?: string;
}) {
  const result = usePlannerDefaults();
  const defaults = 'data' in result ? result.data : undefined;
  const defaultSplit = defaults
    ? defaults.categories.map(({ minutes, ...category }) => ({
        ...category,
        hours: String(minutes / 60),
      }))
    : [];

  const [open, setOpen] = useState(false);
  const [split, setSplit] = useState(defaultSplit);
  const [startTime, setStartTime] = useState(initialStartTime);
  const initialTargetHours =
    summary.targetMinutes === undefined
      ? ''
      : String(summary.targetMinutes / 60);
  const [targetHours, setTargetHours] = useState(initialTargetHours);
  const [feedback, setFeedback] = useState<'unbalanced' | 'ready'>();
  const formId = useId();
  const allocatedHours = split.reduce(
    (total, category) => total + Number(category.hours),
    0,
  );
  const balanced =
    split.length > 0 &&
    targetHours !== '' &&
    allocatedHours === Number(targetHours);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      setSplit(
        summary.rows.map(({ category, allocatedMinutes }) => ({
          ...category,
          hours: String(allocatedMinutes / 60),
        })),
      );
      setStartTime(initialStartTime);
      setTargetHours(initialTargetHours);
      setFeedback(undefined);
    }

    setOpen(nextOpen);
  }

  function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(balanced ? 'ready' : 'unbalanced');
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={changeOpen}
      title="Adjust today's plan"
      description="Set today's target and choose how to spend it. Rebuilding replaces today's blocks, notes, and progress."
      trigger={
        <Button
          type='button'
          variant='outline'
          className='w-full flex-wrap gap-2 text-xs'
        >
          <SlidersHorizontal className='size-3.5' aria-hidden='true' />
          Adjust today&apos;s plan
          <ArrowUpRight className='size-3.5' aria-hidden='true' />
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
            Build day plan
            <ArrowRight aria-hidden='true' />
          </Button>
        </>
      }
    >
      <form id={formId} className='grid gap-6' onSubmit={submitForm}>
        <Field className='gap-2'>
          <div className='flex items-center justify-between gap-2'>
            <FieldLabel htmlFor={`${formId}-start`}>
              Start your day at
            </FieldLabel>

            <span className='text-muted-foreground text-xs'>{timezone}</span>
          </div>

          <TimeInput
            id={`${formId}-start`}
            name='start'
            value={startTime}
            onChange={(event) => {
              setStartTime(event.target.value);
              setFeedback(undefined);
            }}
            required
          />
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor={`${formId}-target-hours`}>
            Target hours
          </FieldLabel>

          <Input
            id={`${formId}-target-hours`}
            name='targetHours'
            type='number'
            inputMode='decimal'
            min={0.25}
            max={24}
            step={0.25}
            value={targetHours}
            onChange={(event) => {
              setTargetHours(event.target.value);
              setFeedback(undefined);
            }}
            required
          />
        </Field>

        <Separator />

        <FieldSet className='min-w-0 gap-4'>
          <FieldLegend className='mb-1'>Categories &amp; hours</FieldLegend>

          <p className='text-muted-foreground text-sm'>
            Choose how much time to spend on each category.
          </p>

          <Button
            type='button'
            variant='outline'
            className='text-xxs w-full self-start'
            disabled={!defaults}
            onClick={() => {
              setSplit(defaultSplit);
              if (defaults) setTargetHours(String(defaults.targetMinutes / 60));
              setFeedback(undefined);
            }}
          >
            Use my default categories &amp; split
          </Button>

          <div className='grid gap-3'>
            {split.map((category) => {
              const inputId = `${formId}-${category.id}`;

              return (
                <Field
                  key={category.id}
                  orientation='horizontal'
                  className='justify-between'
                >
                  <FieldLabel
                    htmlFor={inputId}
                    className='tracking-normal normal-case'
                  >
                    <CategoryIcon
                      name={category.icon}
                      className='size-4 shrink-0'
                      style={{ color: `var(--task-${category.color})` }}
                      aria-hidden='true'
                    />
                    {category.name}
                  </FieldLabel>

                  <InputGroup className='w-24 shrink-0'>
                    <InputGroupInput
                      id={inputId}
                      type='number'
                      inputMode='decimal'
                      min={0}
                      max={targetHours || undefined}
                      step={0.25}
                      value={category.hours}
                      onChange={(event) => {
                        const hours = event.target.value;
                        setSplit((current) =>
                          current.map((item) =>
                            item.id === category.id ? { ...item, hours } : item,
                          ),
                        );
                        setFeedback(undefined);
                      }}
                      required
                    />

                    <InputGroupAddon align='inline-end' className='py-0 pr-2'>
                      <InputGroupText>hrs</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              );
            })}
          </div>

          <TotalAllocation
            allocatedHours={allocatedHours}
            targetHours={targetHours}
            balanced={balanced}
          />
        </FieldSet>

        {feedback === 'unbalanced' && (
          <FieldError>
            Allocate the full daily target across the categories.
          </FieldError>
        )}

        {feedback === 'ready' && (
          <p role='status' className='text-muted-foreground text-sm'>
            Your split matches the target. Day plan generation is still pending.
          </p>
        )}
      </form>
    </ResponsiveDialog>
  );
}
