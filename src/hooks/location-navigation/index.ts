import { useCallback } from 'react';

import { useSearchParams } from 'next/navigation';

import { tmpCameraAtom } from '@/store/map';

import { useQueryClient } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import { useSetAtom } from 'jotai';

import type { Location, LocationTypes } from '@/containers/datasets/locations/types';

type BBox = [number, number, number, number];

type NavTarget =
  | { type: 'worldwide' }
  | { type: 'country'; iso: string }
  | { type: 'wdpa'; locationId: string | number }
  | { type: 'custom-area' };

export const buildPath = (target: NavTarget): string => {
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
      if (!location.location_id) return { type: 'worldwide' };
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
  const queryClient = useQueryClient();

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
      const target = locationToNavTarget(location);

      // Seed `useLocation`'s cache with the object we already have. Without it,
      // the new key has no data and `useLocation` hands out its worldwide-shaped
      // placeholder, so every widget fetches and flashes worldwide data until
      // `/locations/:id` resolves.
      const urlId =
        target.type === 'country'
          ? target.iso
          : target.type === 'wdpa'
            ? String(target.locationId)
            : null;
      if (urlId) {
        queryClient.setQueryData(['location', target.type, urlId], { data: location });
      }

      const bbox = location.bounds ? (turfBbox(location.bounds) as BBox) : null;
      navigate(target, bbox);
    },
    [navigate, queryClient]
  );

  return { navigate, navigateToLocation };
}
