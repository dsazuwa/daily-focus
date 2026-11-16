import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ChangeDefaultsDialog() {
  return (
    <Button
      type='button'
      variant='ghost'
      className='text-muted-foreground w-full flex-wrap gap-2 text-xs'
    >
      <Settings2 className='size-3' aria-hidden='true' />
      Change my defaults
    </Button>
  );
}
