import { useSyncExternalStore } from 'react';

function subscribeToWindowFocus(onFocus: () => void) {
  window.addEventListener('focus', onFocus);
  return () => window.removeEventListener('focus', onFocus);
}

function getBrowserTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone === 'UTC' ? 'Etc/UTC' : timezone;
}

export function useBrowserTimezone() {
  return useSyncExternalStore(
    subscribeToWindowFocus,
    getBrowserTimezone,
    () => '',
  );
}
