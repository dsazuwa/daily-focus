import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function AdjustSplitDialog() {
  return (
    <Button variant='outline' className='w-full flex-wrap gap-2 text-xs'>
      <SlidersHorizontal className='size-3.5' aria-hidden='true' />
      Adjust daily split
      <ArrowUpRight className='size-3.5' aria-hidden='true' />
    </Button>
  );
}
