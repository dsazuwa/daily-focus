'use client';

import CalendarDays from 'lucide-react/icons/calendar-days';
import ListTodo from 'lucide-react/icons/list-todo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { getDailySchedule } from '@/lib/supabase/queries';
import type { PlanSummaryByMonth } from '@/lib/types';
import CalendarView from './calendar-view';
import DailyView from './daily-view';

export default function PlannerViews({
  today,
  selectedDate,
  selectedMonth,
  calendarSummary,
  dailySchedule,
}: {
  today: string;
  selectedDate: string;
  selectedMonth: string | undefined;
  dailySchedule: Awaited<ReturnType<typeof getDailySchedule>> | undefined;
  calendarSummary: PlanSummaryByMonth | undefined;
}) {
  const router = useRouter();
  const currentMonth = today.slice(0, 7);
  const [lastOpenedDay, setLastOpenedDay] = useState(
    selectedMonth ? undefined : selectedDate,
  );

  if (!selectedMonth && selectedDate !== lastOpenedDay)
    setLastOpenedDay(selectedDate);

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
        {dailySchedule && (
          <DailyView
            selectedDate={selectedDate}
            today={today}
            schedule={dailySchedule.data}
            scheduleError={dailySchedule.error}
            onSelectDate={selectDate}
            onRetry={() => router.refresh()}
          />
        )}
      </TabsContent>

      <TabsContent
        value='calendar-view'
        className='border-border py-uniform gap-uniform flex flex-col border-t border-solid'
      >
        {selectedMonth && (
          <CalendarView
            month={selectedMonth}
            today={today}
            lastOpenedDay={lastOpenedDay}
            summary={calendarSummary}
            onSelectMonth={selectMonth}
            onSelectDate={selectDate}
            onRetry={() => router.refresh()}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
