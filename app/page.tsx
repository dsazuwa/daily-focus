import { cookies } from 'next/headers';
import { connection } from 'next/server';

import HomePage from '@/components/pages/home';
import LoginPage from '@/components/pages/login';
import { getDateKey } from '@/lib/dates';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  await connection();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <LoginPage />;

  return <HomePage today={getDateKey(new Date())} />;
}
