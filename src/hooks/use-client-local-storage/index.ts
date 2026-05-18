'use client';

import { useEffect, useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

/**
 * SSR-safe wrapper around `useLocalStorage` from `usehooks-ts`.
 *
 * Why: the upstream hook reads `localStorage` synchronously in its
 * `useState` initializer on the client, but returns `initialValue` on the
 * server. When the stored value differs from `initialValue` (e.g. Playwright
 * fixtures seed localStorage pre-hydration), this causes React #418 in
 * production builds. This wrapper holds back the stored value until after
 * mount, so the first client render matches the server.
 */
export function useClientLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useLocalStorage<T>(key, initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Intentional: flip a one-shot flag after mount so the next render swaps
    // in the real stored value. The single cascading render is the hydration
    // boundary itself — exactly the pattern React 18 docs prescribe when the
    // upstream hook can't expose a server snapshot (usehooks-ts doesn't).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  return [hydrated ? stored : initialValue, setStored];
}
