import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesHiResLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const SOURCE = useSource();
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const LAYERS = useLayers({
    id,
    opacity: activeLayer ? parseFloat(activeLayer.opacity) : 1,
    visibility: activeLayer?.visibility ?? 'visible',
  });

  useEffect(() => {
    const ids = LAYERS.map((layer) => layer.id);
    onAdd(ids);
    return () => onRemove(ids);
  }, [onAdd, onRemove]);

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesHiResLayer;
