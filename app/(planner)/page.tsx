import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getPlannerDefaultsAction } from '@/app/actions/planner-defaults';
import BrowserTimezoneSync from './_components/browser-timezone-sync';
import PlannerViews from './_components/planner-views';
import {
  BROWSER_TIME_ZONE_COOKIE,
  getDateKey,
  isDateKey,
  isMonthKey,
  isValidTimeZone,
} from '@/lib/dates';
import {
  getDailySchedule,
  getPlanSummaryByMonth,
} from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';

export default async function Home({ searchParams }: PageProps<'/'>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { date, month } = await searchParams;
  const defaultsResult = await getPlannerDefaultsAction();
  const accountTimezone =
    'data' in defaultsResult ? defaultsResult.data?.timezone : undefined;
  const browserTimezone = cookieStore.get(BROWSER_TIME_ZONE_COOKIE)?.value;
  const hasAccountTimezone = isValidTimeZone(accountTimezone);
  const browserFallback = isValidTimeZone(browserTimezone)
    ? browserTimezone
    : 'UTC';
  const timezone = hasAccountTimezone ? accountTimezone : browserFallback;
  const today = getDateKey(new Date(), timezone);

  if (date !== undefined) {
    if (!isDateKey(date)) redirect('/');
    if (month !== undefined) redirect(`/?date=${date}`);
  } else if (month !== undefined && !isMonthKey(month)) {
    redirect(`/?month=${today.slice(0, 7)}`);
  }

  const selectedMonth = typeof month === 'string' ? month : undefined;
  const selectedDate = date ?? today;

  const dailySchedule = selectedMonth
    ? undefined
    : await getDailySchedule(supabase, selectedDate);

  const calendarResult = selectedMonth
    ? await getPlanSummaryByMonth(supabase, selectedMonth)
    : undefined;

  return (
    <>
      {!hasAccountTimezone && <BrowserTimezoneSync />}

      <PlannerViews
        today={today}
        selectedDate={selectedDate}
        dailySchedule={dailySchedule}
        selectedMonth={selectedMonth}
        calendarSummary={calendarResult?.data}
      />
    </>
  );
}
