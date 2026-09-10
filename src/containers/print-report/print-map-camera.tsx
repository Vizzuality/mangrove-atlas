'use client';

import { useEffect, useRef } from 'react';

import { useMap } from 'react-map-gl';

import { useSyncURLBounds } from '@/store/map';

import turfBbox from '@turf/bbox';
import type { LngLatBoundsLike } from 'mapbox-gl';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';

/**
 * Frames the report map on the location when the URL carries no bounds.
 *
 * The map is rendered by the report *layout*, which React renders before the
 * page's `HydrationBoundary` seeds the prefetched `location-bounds` — so the
 * map's own `initialViewState` lookup comes up empty and it opens on the world
 * view. Fitting here, once the location query has resolved, is what makes the
 * printed map show the place the report is about.
 */
const PrintMapCamera = ({ mapId = 'print-report' }: { mapId?: string }) => {
  const maps = useMap();
  const map = maps[mapId];

  const [URLBounds] = useSyncURLBounds();
  const { type, id } = useSyncLocation();
  const locationType = (type ?? 'worldwide') as LocationTypes;

  const { data } = useLocation(id, locationType, { enabled: !!id });

  // The worldwide branch of the union carries no geometry.
  const locationBounds = data && 'bounds' in data ? data.bounds : null;

  // One-shot: after this the map keeps whatever camera the user set.
  const hasFitted = useRef(false);

  useEffect(() => {
    if (hasFitted.current || !map || URLBounds || !locationBounds) return;
    hasFitted.current = true;
    map.fitBounds(turfBbox(locationBounds) as LngLatBoundsLike, { padding: 20, duration: 0 });
  }, [map, URLBounds, locationBounds]);

  return null;
};

export default PrintMapCamera;
