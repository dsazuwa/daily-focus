'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useBrowserTimezone } from '@/hooks/use-browser-timezone';
import { BROWSER_TIME_ZONE_COOKIE } from '@/lib/dates';

export default function BrowserTimezoneSync() {
  const timezone = useBrowserTimezone();
  const router = useRouter();

  useEffect(() => {
    if (!timezone) return;

    const cookie = `${BROWSER_TIME_ZONE_COOKIE}=${timezone}`;
    const hasTimezoneCookie = () =>
      document.cookie.split('; ').includes(cookie);

    if (hasTimezoneCookie()) return;

    // eslint-disable-next-line unicorn-x/no-document-cookie -- Keep cookie writes available in browsers without Cookie Store.
    document.cookie = `${cookie}; Path=/; SameSite=Lax; Max-Age=31536000`;
    if (hasTimezoneCookie()) router.refresh();
  }, [router, timezone]);

  // eslint-disable-next-line unicorn-x/no-null -- This component renders no UI.
  return null;
}
