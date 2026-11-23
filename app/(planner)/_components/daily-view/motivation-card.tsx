import { Card, CardContent } from '@/components/ui/card';

export default function MotivationCard() {
  return (
    <Card size='sm' className='bg-transparent py-0 shadow-none ring-0'>
      <CardContent className='space-y-3 max-md:px-0'>
        <span
          className='text-primary block text-3xl leading-none'
          aria-hidden='true'
        >
          ✳
        </span>

        <h3 className='text-section-title'>
          Consistency over perfection
        </h3>

        <p className='text-section-description'>
          The plan can change, what matters is that you keep showing up
        </p>

        <span className='bg-border block h-px w-8' aria-hidden='true' />
      </CardContent>
    </Card>
  );
}
