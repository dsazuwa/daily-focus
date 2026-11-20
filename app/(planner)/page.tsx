import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import PlannerViews from '@/app/(planner)/planner-views';
import { getDateKey } from '@/lib/dates';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return <PlannerViews today={getDateKey(new Date())} />;
}
