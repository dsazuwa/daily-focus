'use client';

import {
  BookOpen,
  Briefcase,
  CodeXml,
  DollarSign,
  Dumbbell,
  Flame,
  FolderKanban,
  GraduationCap,
  Heart,
  Home,
  Lightbulb,
  Music,
  Palette,
  Plane,
  ShoppingCart,
  Sparkles,
  Tag,
  Target,
  Users,
  Utensils,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { TaskColor } from '@/lib/types';

const iconOptions = [
  // General & Organization
  { value: 'tag', label: 'General', Icon: Tag },
  { value: 'folder-kanban', label: 'Projects', Icon: FolderKanban },
  { value: 'target', label: 'Goals', Icon: Target },
  { value: 'sparkles', label: 'Priority', Icon: Sparkles },

  // Work & Tech
  { value: 'briefcase', label: 'Work', Icon: Briefcase },
  { value: 'code-xml', label: 'Development', Icon: CodeXml },
  { value: 'lightbulb', label: 'Ideas', Icon: Lightbulb },
  { value: 'dollar-sign', label: 'Finance', Icon: DollarSign },

  // Learning & Creativity
  { value: 'book-open', label: 'Reading', Icon: BookOpen },
  { value: 'graduation-cap', label: 'Study', Icon: GraduationCap },
  { value: 'palette', label: 'Design & Art', Icon: Palette },
  { value: 'music', label: 'Music', Icon: Music },

  // Health & Habits
  { value: 'dumbbell', label: 'Fitness', Icon: Dumbbell },
  { value: 'heart', label: 'Health & Wellness', Icon: Heart },
  { value: 'flame', label: 'Habits', Icon: Flame },
  { value: 'utensils', label: 'Meals', Icon: Utensils },

  // Life, Errands & Social
  { value: 'home', label: 'Home & Chores', Icon: Home },
  { value: 'shopping-cart', label: 'Shopping', Icon: ShoppingCart },
  { value: 'users', label: 'Social & Family', Icon: Users },
  { value: 'plane', label: 'Travel', Icon: Plane },
] as const;

type PlannerIcon = (typeof iconOptions)[number]['value'];

export function IconPicker({
  label,
  color,
  icon,
  onChange,
}: {
  label: string;
  color?: TaskColor;
  icon: string;
  onChange: (icon: PlannerIcon) => void;
}) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const selectedIcon =
    iconOptions.find(({ value }) => value === icon) ?? iconOptions[0];
  const { Icon } = selectedIcon;

  return (
    <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
      <PopoverTrigger
        render={
          <Button
            type='button'
            variant='outline'
            size='icon-sm'
            className='shrink-0'
            aria-label={`${label}. Current icon: ${selectedIcon.label}`}
            style={color ? { color: `var(--task-${color})` } : undefined}
          />
        }
      >
        <Icon aria-hidden='true' strokeWidth={3} />
      </PopoverTrigger>

      <PopoverContent align='start' className='grid w-auto grid-cols-4 gap-1'>
        {iconOptions.map(({ value, label, Icon: OptionIcon }) => {
          const selected = value === icon;

          return (
            <Button
              key={value}
              type='button'
              variant={selected ? 'secondary' : 'ghost'}
              size='icon-sm'
              aria-label={label}
              aria-pressed={selected}
              title={label}
              onClick={() => {
                onChange(value);
                setIconPickerOpen(false);
              }}
            >
              <OptionIcon aria-hidden='true' strokeWidth={3} />
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
