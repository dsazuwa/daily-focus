'use client';

import { Settings2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

export function ChangeDefaultsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title='Change default settings'
      description='Update your default configuration here.'
      trigger={
        <Button
          type='button'
          variant='ghost'
          aria-label='Change default settings'
        >
          <Settings2 className='size-3' aria-hidden='true' />
        </Button>
      }
    >
      <div></div>
    </ResponsiveDialog>
  );
}
