import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import PlannerViews from './_components/planner-views';
import { getDateKey, parseDateKey } from '@/lib/dates';
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
    if (typeof date !== 'string' || !isDateKey(date)) redirect('/');
    if (month !== undefined) redirect(`/?date=${date}`);
  } else if (
    month !== undefined &&
    (typeof month !== 'string' || !isDateKey(`${month}-01`))
  ) {
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

function isDateKey(key: string) {
  try {
    parseDateKey(key);
    return true;
  } catch {
    return false;
  }
}
