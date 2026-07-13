import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import type { LayerProps } from 'types/layers';

import { useLayers, useSources } from './hooks';

const MangrovesAlertsLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);

  const SOURCES = useSources();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  useEffect(() => {
    const ids = Object.values(LAYERS)
      .flat()
      .map((l) => l.id);
    onAdd(ids);
    return () => onRemove(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAdd, onRemove]);

  if (!SOURCES || !LAYERS) return null;

  return SOURCES.map((SOURCE) => (
    <Source key={SOURCE.id} {...SOURCE}>
      {SOURCE.id &&
        LAYERS[SOURCE.id as keyof typeof LAYERS]?.map((LAYER) => (
          <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
        ))}
    </Source>
  ));
};

export default MangrovesAlertsLayer;
