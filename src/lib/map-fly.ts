import type { MapRef } from 'react-map-gl';

import type { FitBoundsOptions } from 'mapbox-gl';

import { breakpoints } from '@/styles/styles.config';

let mapRef: MapRef | null = null;

export function registerMapRef(ref: MapRef | null) {
  mapRef = ref;
}

export function flyMapTo(bbox: [number, number, number, number], options?: FitBoundsOptions) {
  if (!mapRef) return;

  const screenWidth = window.innerWidth;
  const defaultOptions: FitBoundsOptions = {
    padding: {
      top: 50,
      right: 20,
      bottom: 50,
      left: screenWidth >= breakpoints.lg ? 620 + 20 : 20,
    },
  };

  mapRef.fitBounds(
    [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ],
    options ?? defaultOptions
  );
}
