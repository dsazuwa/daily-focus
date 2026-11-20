import CalendarDays from 'lucide-react/icons/calendar-days';
import ListTodo from 'lucide-react/icons/list-todo';

import CalendarView from './calendar-view';
import DailyView from './daily-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PlannerViews({ today }: { today: string }) {
  return (
    <Tabs defaultValue='daily-view' className='gap-uniform w-full flex-1'>
      <TabsList>
        <TabsTrigger value='daily-view'>
          <ListTodo /> Daily
        </TabsTrigger>

        <TabsTrigger value='calendar-view'>
          <CalendarDays /> Calendar
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value='daily-view'
        className='border-border py-uniform gap-uniform flex flex-col border-t border-solid'
      >
        <DailyView selectedDate={today} today={today} />
      </TabsContent>

      <TabsContent
        value='calendar-view'
        className='border-border py-uniform gap-uniform flex flex-col border-t border-solid'
      >
        <CalendarView />
      </TabsContent>
    </Tabs>
  );
}
