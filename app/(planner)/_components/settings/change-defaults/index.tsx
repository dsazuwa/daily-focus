'use client';

import { Check, Clock, Inbox, Plus, Settings2 } from 'lucide-react';
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
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { Separator } from '@/components/ui/separator';
import { CategoryField, type CategoryDraft } from './category-field';
import { TimezoneField, useBrowserTimezone } from './timezone-field';

type DefaultsDraft = {
  categories: CategoryDraft[];
  defaultStartTime: string;
  timezone: string;
  targetHours: string;
};

const initialDefaults: DefaultsDraft = {
  categories: [],
  defaultStartTime: '08:00',
  timezone: '',
  targetHours: '8',
};

export function ChangeDefaultsDialog() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(initialDefaults);
  const [draft, setDraft] = useState(initialDefaults);
  const [error, setError] = useState('');
  const [timezoneReferenceTime, setTimezoneReferenceTime] = useState(
    () => new Date(),
  );

  const fieldId = useId();
  const formId = `${fieldId}-form`;

  const browserTimezone = useBrowserTimezone();
  const { categories, defaultStartTime, targetHours } = draft;
  const timezone = draft.timezone || browserTimezone;
  const allocatedHours = categories.reduce(
    (total, category) => total + Number(category.hours),
    0,
  );
  const allocationMatches =
    targetHours !== '' && allocatedHours === Number(targetHours);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(saved);
      setError('');
      setTimezoneReferenceTime(new Date());
    }

    setOpen(nextOpen);
  }

  function updateDraft(changes: Partial<DefaultsDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
    setError('');
  }

  function updateCategory(
    id: string,
    changes: Partial<Omit<CategoryDraft, 'id'>>,
  ) {
    updateDraft({
      categories: categories.map((category) =>
        category.id === id ? { ...category, ...changes } : category,
      ),
    });
  }

  function moveCategory(index: number, offset: number) {
    const reordered = [...categories];
    const destination = index + offset;
    [reordered[index], reordered[destination]] = [
      reordered[destination],
      reordered[index],
    ];
    updateDraft({ categories: reordered });
  }

  function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (categories.length === 0) {
      setError('Add at least one category.');
      return;
    }

    if (categories.some(({ name }) => !name.trim())) {
      setError('Enter a name for every category.');
      return;
    }

    if (!allocationMatches) {
      setError('Allocate the full daily target across your categories.');
      return;
    }

    setSaved({
      ...draft,
      timezone,
      categories: categories.map((category) => ({
        ...category,
        name: category.name.trim(),
      })),
    });
    changeOpen(false);
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={changeOpen}
      title='Your day, by default.'
      description='Choose the categories and hours for new daily plans. Previously saved plans keep their categories and progress.'

      trigger={
        <Button
          type='button'
          variant='ghost'
          aria-label='Change default settings'
        >
          <Settings2 className='size-3' aria-hidden='true' />
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
            Save defaults
          </Button>
        </>
      }
    >
      <form id={formId} className='grid gap-6' onSubmit={submitForm}>
        <Field className='gap-2'>
          <FieldLabel htmlFor={`${fieldId}-start-time`}>
            Default start time
          </FieldLabel>

          <div className='relative'>
            <Input
              id={`${fieldId}-start-time`}
              name='defaultStartTime'
              type='time'
              className='relative pr-8 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:size-3.5 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-datetime-edit]:p-0'
              value={defaultStartTime}
              onChange={(event) =>
                updateDraft({ defaultStartTime: event.target.value })
              }
              required
            />

            <Clock
              aria-hidden='true'
              className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 hidden size-3.5 -translate-y-1/2 supports-[selector(::-webkit-calendar-picker-indicator)]:block'
            />
          </div>
        </Field>

        <TimezoneField
          timezone={timezone}
          browserTimezone={browserTimezone}
          referenceTime={timezoneReferenceTime}
          onChange={(value) => updateDraft({ timezone: value })}
        />

        <Field className='gap-2'>
          <FieldLabel htmlFor={`${fieldId}-target-hours`}>
            Target hours
          </FieldLabel>

          <Input
            id={`${fieldId}-target-hours`}
            name='targetHours'
            type='number'
            min={0.25}
            max={24}
            step={0.25}
            value={targetHours}
            onChange={(event) =>
              updateDraft({ targetHours: event.target.value })
            }
            required
          />
        </Field>

        <Separator />

        <FieldSet className='min-w-0 gap-4'>
          <FieldLegend className='mb-1'>
            Categories &amp; default hours
          </FieldLegend>

          <p className='text-muted-foreground text-sm'>
            Rename, add, or remove categories. Blocks follow the order below.
          </p>

          {categories.length > 0 ? (
            <div className='grid gap-5'>
              {categories.map((category, index) => (
                <CategoryField
                  key={category.id}
                  category={category}
                  index={index}
                  canMoveUp={index > 0}
                  canMoveDown={index < categories.length - 1}
                  onChange={(changes) => updateCategory(category.id, changes)}
                  onMoveUp={() => moveCategory(index, -1)}
                  onMoveDown={() => moveCategory(index, 1)}
                  onRemove={() =>
                    updateDraft({
                      categories: categories.filter(
                        ({ id }) => id !== category.id,
                      ),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className='border-border text-muted-foreground flex flex-col items-center gap-2 border border-dashed px-4 py-6 text-sm'>
              <Inbox className='size-6' aria-hidden='true' />
              <p>No categories yet</p>
            </div>
          )}

          <Button
            type='button'
            variant='outline'
            className='justify-self-start'
            disabled={categories.length >= 8}
            onClick={() =>
              updateDraft({
                categories: [
                  ...categories,
                  {
                    id: crypto.randomUUID(),
                    name: '',
                    hours: '0',
                    color: 'sage',
                    icon: 'tag',
                  },
                ],
              })
            }
          >
            <Plus aria-hidden='true' />
            Add category{' '}
            <span className='text-muted-foreground'>{categories.length}/8</span>
          </Button>

          <FieldLegend
            className='mb-0 flex items-center justify-between gap-2'
            aria-live='polite'
          >
            <span>Total allocated</span>

            <span className='flex items-center gap-2 lowercase'>
              {allocatedHours} / {targetHours || '—'} hrs
              {allocationMatches && (
                <Check className='size-4' aria-hidden='true' />
              )}
            </span>
          </FieldLegend>
        </FieldSet>

        <FieldError>{error}</FieldError>
      </form>
    </ResponsiveDialog>
  );
}
