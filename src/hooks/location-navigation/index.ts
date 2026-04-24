import { useCallback } from 'react';

import { useSearchParams } from 'next/navigation';

import { tmpCameraAtom } from '@/store/map';

import turfBbox from '@turf/bbox';
import { useSetAtom } from 'jotai';

import type { Location, LocationTypes } from '@/containers/datasets/locations/types';

export type BBox = [number, number, number, number];

export type NavTarget =
  | { type: 'worldwide' }
  | { type: 'country'; iso: string }
  | { type: 'wdpa'; locationId: string | number }
  | { type: 'custom-area' };

const buildPath = (target: NavTarget): string => {
  switch (target.type) {
    case 'worldwide':
      return '/';
    case 'country':
      return `/country/${target.iso}`;
    case 'wdpa':
      return `/wdpa/${target.locationId}`;
    case 'custom-area':
      return '/custom-area';
  }
};

export const locationToNavTarget = (
  location: Pick<Location, 'location_type' | 'iso' | 'location_id'>
): NavTarget => {
  const type = location.location_type as LocationTypes;
  switch (type) {
    case 'country':
      return { type: 'country', iso: location.iso };
    case 'wdpa':
      return { type: 'wdpa', locationId: location.location_id };
    case 'custom-area':
      return { type: 'custom-area' };
    case 'worldwide':
    default:
      return { type: 'worldwide' };
  }
};

export function useLocationNavigation() {
  const searchParams = useSearchParams();
  const setTmpCamera = useSetAtom(tmpCameraAtom);

  const navigate = useCallback(
    (target: NavTarget, bbox?: BBox | null) => {
      const qs = searchParams.toString();
      const path = buildPath(target);
      const url = qs ? `${path}?${qs}` : path;

      if (bbox) {
        setTmpCamera({ bbox });
      } else if (target.type === 'worldwide') {
        setTmpCamera({ worldwide: true });
      }

      // Native history API — no Next router, no RSC refetch, no re-render of
      // the page tree that would interrupt the fly. `usePathname` still reacts
      // to this, so `useSyncLocation` consumers pick up the new location.
      window.history.replaceState(null, '', url);
    },
    [searchParams, setTmpCamera]
  );

  const navigateToLocation = useCallback(
    (location: Location) => {
      const bbox = location.bounds ? (turfBbox(location.bounds) as BBox) : null;
      navigate(locationToNavTarget(location), bbox);
    },
    [navigate]
  );

  return { navigate, navigateToLocation };
}
