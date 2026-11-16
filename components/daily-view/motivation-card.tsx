import { Card, CardContent } from '@/components/ui/card';

export default function MotivationCard() {
  return (
    <Card size='sm' className='bg-transparent py-0 shadow-none ring-0'>
      <CardContent className='space-y-3 max-md:px-0'>
        <span className='text-primary block text-3xl leading-none' aria-hidden='true'>
          ✳
        </span>

        <h3 className='font-heading text-lg tracking-tight'>
          Nulla cursus ante dapibus.
        </h3>

        <p className='text-muted-foreground text-sm leading-relaxed'>
          Sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum
          imperdiet.
        </p>

        <span className='bg-border block h-px w-8' aria-hidden='true' />
      </CardContent>
    </Card>
  );
}
