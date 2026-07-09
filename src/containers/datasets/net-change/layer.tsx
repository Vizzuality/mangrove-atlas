import { Source, Layer, SourceProps } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import { LayerProps } from 'types/layers';

import { useGainLossSources, useLayer, useSources } from './hooks';

const NetChangeLayer = ({ beforeId, id }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);

  const gainLossSources = useGainLossSources();
  const sources = useSources() satisfies SourceProps[];
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!LAYER) return null;

  // Prefer the self-hosted combined gain/loss raster (cacheable → offline-capable,
  // covers later years) when NEXT_PUBLIC_GAIN__LOSS_TILES_URL is set; otherwise
  // fall back to the GCS gain-loss-v4 sources.
  const SOURCES = gainLossSources ?? sources;

  if (!SOURCES?.length) return null;

  return (
    <>
      {SOURCES.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          <Layer key={`${SOURCE.id}-layer`} {...LAYER} id={SOURCE.id} beforeId={beforeId} />
        </Source>
      ))}
    </>
  );
};

export default NetChangeLayer;
