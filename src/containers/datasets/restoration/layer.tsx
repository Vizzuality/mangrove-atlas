import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const SOURCE = useSource();
  const LAYERS = useLayers({ id });

  useEffect(() => {
    const ids = LAYERS.map((layer) => layer.id);
    onAdd(ids);
    return () => onRemove(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesLayer;
