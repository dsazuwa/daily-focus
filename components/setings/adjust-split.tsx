'use client';

import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

export default function AdjustSplitDialog() {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title='Adjust daily split'
      description='Customize how your daily targets are split.'
      trigger={
        <Button
          type='button'
          variant='outline'
          className='w-full flex-wrap gap-2 text-xs'
        >
          <SlidersHorizontal className='size-3.5' aria-hidden='true' />
          Adjust daily split
          <ArrowUpRight className='size-3.5' aria-hidden='true' />
        </Button>
      }
    >
      <div></div>
    </ResponsiveDialog>
  );
}
