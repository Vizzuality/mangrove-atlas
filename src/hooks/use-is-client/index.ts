'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

/**
 * `false` during SSR and the hydration pass, `true` afterwards. Use it to gate
 * values that only exist in the browser (`window.location`, the reader's
 * timezone) so they render without tripping a hydration mismatch.
 */
export default function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
