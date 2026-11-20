'use client';

import { useRouter } from 'next/navigation';
import CalendarDays from 'lucide-react/icons/calendar-days';
import ListTodo from 'lucide-react/icons/list-todo';

import CalendarView from './calendar-view';
import DailyView from './daily-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PlannerViews({
  today,
  selectedDate,
  selectedMonth,
}: {
  today: string;
  selectedDate: string;
  selectedMonth: string | undefined;
}) {
  const router = useRouter();
  const currentMonth = today.slice(0, 7);

  const selectDate = (date: string) =>
    router.push(date === today ? '/' : `/?date=${date}`, { scroll: false });

  const selectMonth = (month: string) =>
    router.push(`/?month=${month}`, { scroll: false });

  return (
    <Tabs
      className='gap-uniform w-full flex-1'
      value={selectedMonth ? 'calendar-view' : 'daily-view'}
      onValueChange={(view) => {
        if (view === 'calendar-view') selectMonth(currentMonth);
        if (view === 'daily-view') selectDate(today);
      }}
    >
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
        <DailyView
          selectedDate={selectedDate}
          today={today}
          onSelectDate={selectDate}
        />
      </TabsContent>

      <TabsContent
        value='calendar-view'
        className='border-border py-uniform gap-uniform flex flex-col border-t border-solid'
      >
        <CalendarView
          month={selectedMonth ?? currentMonth}
          today={today}
          onSelectMonth={selectMonth}
          onSelectDate={selectDate}
        />
      </TabsContent>
    </Tabs>
  );
}
