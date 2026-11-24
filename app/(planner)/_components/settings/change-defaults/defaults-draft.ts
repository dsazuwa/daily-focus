import type { PlannerDefaults } from '@/lib/types';
import type { CategoryDraft } from './category-field';

export type DefaultsDraft = {
  categories: CategoryDraft[];
  timezone: string;
  targetHours: string;
};

const emptyDefaultsDraft: DefaultsDraft = {
  categories: [],
  timezone: '',
  targetHours: '8',
};

export function toDefaultsDraft(defaults?: PlannerDefaults): DefaultsDraft {
  if (!defaults) return emptyDefaultsDraft;

  return {
    categories: defaults.categories.map(({ minutes, ...category }) => ({
      ...category,
      hours: String(minutes / 60),
    })),
    timezone: defaults.timezone,
    targetHours: String(defaults.targetMinutes / 60),
  };
}

export function validateDefaultsDraft(
  draft: DefaultsDraft,
): { data: PlannerDefaults; error?: never } | { error: string } {
  if (draft.categories.length === 0)
    return { error: 'Add at least one category.' };

  const targetMinutes = Number(draft.targetHours) * 60;
  if (targetMinutes < 15 || targetMinutes > 1440 || targetMinutes % 15 !== 0)
    return {
      error:
        'Choose a daily target from 15 minutes to 24 hours in 15-minute increments.',
    };

  const categories: PlannerDefaults['categories'] = [];
  let allocatedMinutes = 0;

  for (const { hours, name, ...category } of draft.categories) {
    const trimmedName = name.trim();
    if (!trimmedName) return { error: 'Enter a name for every category.' };

    const minutes = Number(hours) * 60;
    if (!hours.trim() || minutes < 0 || minutes % 15 !== 0)
      return {
        error: `Enter hours for ${trimmedName} in 15-minute increments.`,
      };

    categories.push({ ...category, name: trimmedName, minutes });
    allocatedMinutes += minutes;
  }

  const difference = targetMinutes - allocatedMinutes;
  if (difference > 0) return { error: `Allocate ${difference} more minutes.` };

  if (difference < 0)
    return { error: `Remove ${-difference} minutes from your allocations.` };

  return {
    data: {
      timezone: draft.timezone,
      targetMinutes,
      categories,
    },
  };
}
