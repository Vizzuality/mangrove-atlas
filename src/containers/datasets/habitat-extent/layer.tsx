import { useEffect, useMemo, useState } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';
import { habitatExtentSettings } from '@/store/widgets/habitat-extent';

import { useAtomValue } from 'jotai';
import type { ExpressionSpecification } from 'mapbox-gl';

import type { LayerProps } from 'types/layers';

import { useMangroveHabitatExtent } from './hooks';

const DEFAULT_transitionMs = 600;

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
