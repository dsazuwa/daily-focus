import CalendarDays from 'lucide-react/icons/calendar-days';
import ListTodo from 'lucide-react/icons/list-todo';

import CalendarView from '@/components/calendar-view';
import DailyView from '@/components/daily-view';
import AppBar from '@/components/layout/app-bar';
import Footer from '@/components/layout/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage({ today }: { today: string }) {
  return (
    <>
      <AppBar />

      <main className='flex flex-1 flex-col'>
        <div className='gap-uniform pt-uniform container mx-auto flex h-full flex-1 flex-col px-4'>
          <div className='space-y-1'>
            <p className='text-eyebrow'>laboris culpa excepturi</p>

            <h1 className='text-heading'>
              Est nam dolor magna blanditiis dolor<span>.</span>
            </h1>

            <p className='text-body'>Eligendi quo assumenda at dignissimos</p>
          </div>

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
        </div>
      </main>
      
      <Footer />
    </>
  );
}
