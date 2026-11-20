import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import PlannerViews from './_components/planner-views';
import { getDateKey, isDateKey, isMonthKey } from '@/lib/dates';
import { createClient } from '@/lib/supabase/server';

export default async function Home({ searchParams }: PageProps<'/'>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { date, month } = await searchParams;
  const today = getDateKey(new Date());

  if (date !== undefined) {
    if (!isDateKey(date)) redirect('/');
    if (month !== undefined) redirect(`/?date=${date}`);
  } else if (month !== undefined && !isMonthKey(month)) {
    redirect(`/?month=${today.slice(0, 7)}`);
  }

  return (
    <PlannerViews
      today={today}
      selectedDate={date ?? today}
      selectedMonth={typeof month === 'string' ? month : undefined}
    />
  );
}
