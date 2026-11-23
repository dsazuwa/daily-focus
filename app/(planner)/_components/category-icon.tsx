'use client';

import type { LucideProps } from 'lucide-react';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';
import type { IconName } from 'lucide-react/dynamic';
import BookOpen from 'lucide-react/icons/book-open';

import type { TaskCategory } from '@/lib/types';

const supportedIcons = new Set<string>(iconNames);

type CategoryIconProps = LucideProps & {
  name: TaskCategory['icon'];
};

export function CategoryIcon({
  name,
  strokeWidth = 3,
  ...props
}: CategoryIconProps) {
  if (!supportedIcons.has(name)) {
    return <BookOpen strokeWidth={strokeWidth} {...props} />;
  }

  return (
    <DynamicIcon
      key={name}
      name={name as IconName}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
