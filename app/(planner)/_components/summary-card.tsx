import type { ReactNode } from 'react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SummaryCardProps = {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

export default function SummaryCard({
  title,
  description,
  children,
}: SummaryCardProps) {
  return (
    <Card className='bg-primary text-primary-foreground ring-0 md:flex-row md:items-center md:justify-between'>
      <CardHeader className='flex-1 md:pr-0'>
        <CardTitle>{title}</CardTitle>

        <CardDescription className='text-primary-foreground/80'>
          {description}
        </CardDescription>
      </CardHeader>

      {children}
    </Card>
  );
}

type SummaryStatProps = {
  label: string;
  value: string | number;
};

export function SummaryStat({ label, value }: SummaryStatProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <span className='text-eyebrow'>{label}</span>
      <strong className='text-stat tabular-nums'>{value}</strong>
    </div>
  );
}
