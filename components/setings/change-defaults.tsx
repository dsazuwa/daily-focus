import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ChangeDefaultsDialog() {
  return (
    <Button
      type='button'
      variant='ghost'
      aria-label='Change default settings'
    >
      <Settings2 className='size-3' aria-hidden='true' /> 
    </Button>
  );
}
