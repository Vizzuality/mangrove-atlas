import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  useEffect(() => {
    if (activeLayer) {
      onAdd(LAYERS.map((layer) => layer.id));
      return () => onRemove(LAYERS.map((layer) => layer.id));
    }
  }, [onAdd, onRemove, LAYERS, activeLayer]);

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((layer) => (
        <Layer key={layer.id} {...layer} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesLayer;
