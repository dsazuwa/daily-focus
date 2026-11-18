'use client';

import { useMemo, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, serverMatches = false): boolean {
  const { subscribe, getSnapshot } = useMemo(() => {
    const mediaQuery = globalThis.matchMedia?.(query);

    return {
      subscribe(onChange: () => void) {
        mediaQuery?.addEventListener('change', onChange);
        return () => mediaQuery?.removeEventListener('change', onChange);
      },
      getSnapshot: () => mediaQuery?.matches ?? serverMatches,
    };
  }, [query, serverMatches]);

  return useSyncExternalStore(subscribe, getSnapshot, () => serverMatches);
}
