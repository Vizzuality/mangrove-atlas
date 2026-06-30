import { useEffect, useMemo, useState } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';
import { isOfflineAtom } from '@/store/offline';
import { habitatExtentSettings } from '@/store/widgets/habitat-extent';

import { useAtomValue } from 'jotai';
import type { ExpressionSpecification } from 'mapbox-gl';

import type { LayerProps } from 'types/layers';

import { env } from '../../../../env.mjs';

import { useMangroveHabitatExtent } from './hooks';

const DEFAULT_transitionMs = 600;

// Prod uses the legacy single multi-tileset source (source-layer `mng_mjr_${year}`).
// Staging uses the per-year GMW v4 tilesets, gated by the timeline_slider feature flag.
const LEGACY_EXTENT_SOURCE_URL =
  'mapbox://globalmangrovewatch.20cshxs9,globalmangrovewatch.b1wlg2x7,globalmangrovewatch.2cws6y26,globalmangrovewatch.bgrhiwte,globalmangrovewatch.aokkuxu7,globalmangrovewatch.0l7s8iga,globalmangrovewatch.a08vpx09,globalmangrovewatch.7kyxxf0e,globalmangrovewatch.1cu4rmy9,globalmangrovewatch.6st408jz,globalmangrovewatch.1clkx4nk';

const isTimelineSliderEnabled = () =>
  JSON.parse(process.env.NEXT_PUBLIC_FEATURED_FLAGS || '{}').timeline_slider === true;

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

const MangrovesHabitatExtentLayer = ({ beforeId, id }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const isOffline = useAtomValue(isOfflineAtom);
  const year = useAtomValue(habitatExtentSettings) as number | null;
  const { data } = useMangroveHabitatExtent({ year });
  const years = useMemo(
    () => (data?.years?.slice().sort((a, b) => a - b) || []) as number[],
    [data?.years]
  );

  const currentYear = year || years[years.length - 1];
  const baseOpacity = parseFloat(activeLayer?.opacity ?? '1');
  const visibility = activeLayer?.visibility ?? 'visible';

  const reducedMotion = usePrefersReducedMotion();
  const transitionMs = reducedMotion ? 0 : DEFAULT_transitionMs;

  if (!years.length || !currentYear) return null;

  // OFFLINE: render the self-hosted raster {z}/{x}/{y} from GCS (cacheable, TOS-safe)
  // instead of the Mapbox vector tilesets (which can't be cached). Raster = no vector
  // interactivity, accepted offline. ONLINE keeps the interactive vector paths below.
  if (isOffline && env.NEXT_PUBLIC_EXTENT_TILES_URL) {
    const tiles = env.NEXT_PUBLIC_EXTENT_TILES_URL.replace(/\{year\}/g, String(currentYear));
    return (
      <Source
        id={`habitat_extent_${currentYear}`}
        type="raster"
        tiles={[tiles]}
        tileSize={256}
        minzoom={0}
        maxzoom={12}
      >
        <Layer
          id={`${id}_${currentYear}_raster`}
          type="raster"
          source={`habitat_extent_${currentYear}`}
          paint={{ 'raster-opacity': baseOpacity }}
          layout={{ visibility }}
          beforeId={beforeId}
        />
      </Source>
    );
  }

  // Prod: legacy single multi-tileset source, only the current year is rendered.
  if (!isTimelineSliderEnabled()) {
    const fillOpacityActive: ExpressionSpecification = [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      baseOpacity * 1.2,
      12,
      baseOpacity,
    ];
    return (
      <Source id="habitat_extent" type="vector" url={LEGACY_EXTENT_SOURCE_URL}>
        <Layer
          key={`${id}_${currentYear}_fill`}
          id={`${id}_${currentYear}_fill`}
          type="fill"
          source="habitat_extent"
          source-layer={`mng_mjr_${currentYear}`}
          paint={{
            'fill-color': '#06C4BD',
            'fill-opacity': fillOpacityActive,
          }}
          layout={{ visibility }}
          beforeId={beforeId}
        />
        <Layer
          key={`${id}_${currentYear}_line`}
          id={`${id}_${currentYear}_line`}
          type="line"
          source="habitat_extent"
          source-layer={`mng_mjr_${currentYear}`}
          paint={{
            'line-color': '#06C4BD',
            'line-opacity': baseOpacity,
            'line-width': ['interpolate', ['linear'], ['zoom'], 0, 8, 12, 1],
            'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 50, 12, 0],
          }}
          layout={{ visibility }}
          beforeId={beforeId}
        />
      </Source>
    );
  }

  // Staging: per-year GMW v4 tilesets with cross-fade between years.
  return (
    <>
      {years.map((y) => {
        const isActive = y === currentYear;
        const fillOpacityActive: ExpressionSpecification = [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          baseOpacity * 1.2,
          12,
          baseOpacity,
        ];
        return (
          <Source
            key={`habitat_extent_${y}`}
            id={`habitat_extent_${y}`}
            type="vector"
            url={`mapbox://globalmangrovewatch.gmw-v4-extent-${y}`}
          >
            <Layer
              id={`${id}_${y}_fill`}
              type="fill"
              source={`habitat_extent_${y}`}
              source-layer={`gmw_v4_extent_${y}`}
              paint={{
                'fill-color': '#06C4BD',
                'fill-opacity': isActive ? fillOpacityActive : 0,
                'fill-opacity-transition': { duration: transitionMs, delay: 0 },
              }}
              layout={{ visibility }}
              beforeId={beforeId}
            />
            <Layer
              id={`${id}_${y}_line`}
              type="line"
              source={`habitat_extent_${y}`}
              source-layer={`gmw_v4_extent_${y}`}
              paint={{
                'line-color': '#06C4BD',
                'line-opacity': isActive ? baseOpacity : 0,
                'line-width': ['interpolate', ['linear'], ['zoom'], 0, 8, 12, 1],
                'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 50, 12, 0],
                'line-opacity-transition': { duration: transitionMs, delay: 0 },
              }}
              layout={{ visibility }}
              beforeId={beforeId}
            />
          </Source>
        );
      })}
    </>
  );
};

export default MangrovesHabitatExtentLayer;
