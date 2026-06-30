import type { MapProps } from 'react-map-gl';

import { env } from '../../../env.mjs';

import { OVERZOOM_MAX } from './tiles';

// Minimal raster Mapbox-GL style for offline mode, built from a TOS-safe raster
// XYZ source (env-provided). Mapbox-hosted basemaps can't be cached, so when the
// map goes offline we swap to this. Undefined when no offline basemap is
// configured — callers then keep the data layers on a neutral background.
export const OFFLINE_BASEMAP_STYLE: MapProps['mapStyle'] = env.NEXT_PUBLIC_OFFLINE_BASEMAP_URL
  ? ({
      version: 8,
      sources: {
        'offline-basemap': {
          type: 'raster',
          tiles: [env.NEXT_PUBLIC_OFFLINE_BASEMAP_URL],
          tileSize: 256,
          // Cap at the cached pyramid depth so Mapbox overzooms (scales) cached
          // tiles for higher zooms instead of requesting uncached children —
          // keeps the basemap visible at every zoom offline.
          maxzoom: OVERZOOM_MAX,
        },
      },
      layers: [
        {
          id: 'offline-basemap',
          type: 'raster',
          source: 'offline-basemap',
          minzoom: 0,
        },
        // Anchor layers the app inserts data layers before (layer-manager uses
        // beforeId 'custom-layers'; country-boundaries uses 'water'). The Mapbox
        // styles ship these slots — replicate them here as invisible anchors so
        // offline data layers land ABOVE the basemap instead of failing to place.
        { id: 'water', type: 'background', layout: { visibility: 'none' }, paint: {} },
        { id: 'custom-layers', type: 'background', layout: { visibility: 'none' }, paint: {} },
      ],
      // Mapbox GL requires glyphs for any symbol layers added later by the app.
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    } as MapProps['mapStyle'])
  : undefined;
