'use client';

import { useEffect } from 'react';

import { initTransifexLive } from '@/lib/transifex-live';

/**
 * Starts Transifex Live after React has hydrated.
 *
 * The snippet in `layout.tsx` sets `manual_init: true`, so `live.js` loads (and
 * stays visible to Transifex's non-JS verification crawler) without touching the
 * DOM until this effect runs. Initialising pre-hydration made Live rewrite the
 * server HTML mid-hydration, which React reported as a text mismatch and
 * recovered from by regenerating the whole tree on the client.
 *
 * Rendered from the root layout so the app, embedded and print-report views all
 * get translations.
 */
const TransifexLiveInit = () => {
  useEffect(() => initTransifexLive(), []);

  return null;
};

export default TransifexLiveInit;
