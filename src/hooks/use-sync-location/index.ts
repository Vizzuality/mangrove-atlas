'use client';

import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import type { LocationTypes } from '@/containers/datasets/locations/types';

const LOCATION_SEGMENTS = ['country', 'wdpa', 'custom-area'] as const;

type LocationSegment = (typeof LOCATION_SEGMENTS)[number];

const isLocationSegment = (value: string): value is LocationSegment =>
  (LOCATION_SEGMENTS as readonly string[]).includes(value);

type SyncedLocation = {
  type: LocationTypes | null;
  id: string | null;
};

const parse = (pathname: string): SyncedLocation => {
  let path = pathname;
  if (path.startsWith('/embedded')) {
    path = path.slice('/embedded'.length) || '/';
  }
  const [, segment, id] = path.split('/');
  if (!segment || !isLocationSegment(segment)) return { type: null, id: null };
  return { type: segment, id: id ?? null };
};

/**
 * Reads the current location (type + id) from the URL pathname. Source of
 * truth for all location consumers — `router.replace` / `history.replaceState`
 * updates flow through Next's `usePathname`, so no explicit sync is needed.
 */
export function useSyncLocation(): SyncedLocation {
  const pathname = usePathname();
  return useMemo(() => parse(pathname ?? '/'), [pathname]);
}
