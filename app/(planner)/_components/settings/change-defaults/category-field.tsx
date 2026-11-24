import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TaskColor } from '@/lib/types';

import { IconPicker } from './icon-picker';

const colors: Record<TaskColor, string> = {
  sage: 'Sage',
  sky: 'Blue',
  sand: 'Sand',
  lavender: 'Lavender',
  rose: 'Rose',
  teal: 'Teal',
  peach: 'Peach',
  indigo: 'Indigo',
  amber: 'Amber',
  slate: 'Slate',
};

export type CategoryDraft = {
  id: string;
  name: string;
  hours: string;
  color: TaskColor;
  icon: string;
};

export function CategoryField({
  category,
  index,
  canMoveUp,
  canMoveDown,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  category: CategoryDraft;
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (changes: Partial<Omit<CategoryDraft, 'id'>>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const categoryLabel = category.name.trim() || `Category ${index + 1}`;

  return (
    <div className='grid min-w-0 grid-cols-[minmax(6.25rem,1fr)_minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_6.25rem_8rem_auto]'>
      <div className='col-span-3 flex min-w-0 items-center gap-2 sm:col-span-1'>
        <IconPicker
          label={`Choose icon for ${categoryLabel}`}
          color={category.color}
          icon={category.icon}
          onChange={(icon) => onChange({ icon })}
        />

        <Input
          aria-label={`Category ${index + 1} name`}
          placeholder='Category name'
          value={category.name}
          onChange={(event) =>
            onChange({
              name: event.target.value,
            })
          }
          maxLength={40}
          required
        />
      </div>

      <InputGroup>
        <InputGroupInput
          aria-label={`Category ${index + 1} hours`}
          type='number'
          inputMode='decimal'
          className='min-w-[calc(4ch+1.25rem)] [appearance:textfield] tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
          value={category.hours}
          onChange={(event) => onChange({ hours: event.target.value })}
          min={0}
          max={24}
          step={0.25}
          required
        />

        <InputGroupAddon align='inline-end' className='py-0 pr-3'>
          <InputGroupText>hrs</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <Select
        items={colors}
        value={category.color}
        onValueChange={(color) => {
          if (color !== null) onChange({ color });
        }}
      >
        <SelectTrigger
          aria-label={`Category ${index + 1} colour`}
          size='sm'
          className='border-input dark:bg-input/30 w-full min-w-0 px-2 sm:px-3'
        >
          <SelectValue className='min-w-0'>
            <ColorSwatch color={category.color} />
            <span className='truncate'>{colors[category.color]}</span>
          </SelectValue>
        </SelectTrigger>

        <SelectContent align='start' alignItemWithTrigger={false}>
          {Object.entries(colors).map(([color, label]) => (
            <SelectItem key={color} value={color}>
              <ColorSwatch color={color} />
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex items-center'>
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          aria-label={`Move ${categoryLabel} up`}
          disabled={!canMoveUp}
          onClick={onMoveUp}
        >
          <ArrowUp aria-hidden='true' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          aria-label={`Move ${categoryLabel} down`}
          disabled={!canMoveDown}
          onClick={onMoveDown}
        >
          <ArrowDown aria-hidden='true' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          aria-label={`Remove ${categoryLabel}`}
          onClick={onRemove}
          className='text-destructive'
        >
          <Trash2 aria-hidden='true' />
        </Button>
      </div>
    </div>
  );
}

function ColorSwatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden='true'
      className='size-3 shrink-0 self-center'
      style={{ backgroundColor: `var(--task-${color})` }}
    />
  );
}
