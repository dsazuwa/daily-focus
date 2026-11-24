'use client';

import { Inbox, Plus, Settings2 } from 'lucide-react';
import { useId, useState, type SubmitEvent } from 'react';

import { changePlannerDefaultsAction } from '@/app/actions/planner-defaults';
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
import { useBrowserTimezone } from '@/hooks/use-browser-timezone';
import { usePlannerDefaultsDialog } from '../../planner-defaults-provider';
import { TotalAllocation } from '../total-allocation';
import { CategoryField, type CategoryDraft } from './category-field';
import {
  toDefaultsDraft,
  validateDefaultsDraft,
  type DefaultsDraft,
} from './defaults-draft';
import { TimezoneField } from './timezone-field';

export default function ChangeDefaultsDialog() {
  const {
    result: defaultsResult,
    dialogOpen,
    dialogOpenedAt,
    setDialogOpen,
  } = usePlannerDefaultsDialog();
  const defaults = 'data' in defaultsResult ? defaultsResult.data : undefined;

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    draft: toDefaultsDraft(defaults),
    error: '',
    timezoneReferenceTime: dialogOpenedAt ?? new Date(),
  }));

  // Start a fresh draft for each opening, including openings from Daily View.
  if (dialogOpenedAt && dialogOpenedAt !== form.timezoneReferenceTime) {
    setForm({
      draft: toDefaultsDraft(defaults),
      error: '',
      timezoneReferenceTime: dialogOpenedAt,
    });
  }

  const { draft, error, timezoneReferenceTime } = form;
  const fieldId = useId();
  const formId = `${fieldId}-form`;

  const browserTimezone = useBrowserTimezone();
  const { categories, targetHours } = draft;
  const timezone = draft.timezone || browserTimezone;

  const allocatedHours = categories.reduce(
    (total, category) => total + Number(category.hours),
    0,
  );
  const allocationMatches =
    targetHours !== '' && allocatedHours === Number(targetHours);

  function changeOpen(nextOpen: boolean) {
    if (!saving) setDialogOpen(nextOpen);
  }

  function updateDraft(changes: Partial<DefaultsDraft>) {
    setForm((current) => ({
      ...current,
      draft: { ...current.draft, ...changes },
      error: '',
    }));
  }

  function showFormError(error: string) {
    setForm((current) => ({ ...current, error }));
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

  async function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || defaultsResult.error) return;

    const validation = validateDefaultsDraft({ ...draft, timezone });
    if (!('data' in validation)) {
      showFormError(validation.error);
      return;
    }

    setSaving(true);
    showFormError('');

    try {
      const result = await changePlannerDefaultsAction(validation.data);

      if (result.error) {
        showFormError(result.error);
        return;
      }

      setDialogOpen(false);
    } catch {
      showFormError('Unable to save planner defaults.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ResponsiveDialog
      open={dialogOpen}
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
            disabled={saving}
            onClick={() => changeOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type='submit'
            form={formId}
            disabled={saving || Boolean(defaultsResult.error)}
          >
            {saving ? 'Saving…' : 'Save defaults'}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className='grid gap-6'
        aria-busy={saving}
        inert={saving}
        onSubmit={submitForm}
      >
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

          <TotalAllocation
            allocatedHours={allocatedHours}
            targetHours={targetHours}
            balanced={allocationMatches}
          />
        </FieldSet>

        <FieldError>{defaultsResult.error || error}</FieldError>
      </form>
    </ResponsiveDialog>
  );
}
