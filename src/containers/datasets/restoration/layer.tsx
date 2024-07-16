import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangrovesLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers.find((l) => l.id === id);
  const SOURCE = useSource();
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  useEffect(() => {
    if (activeLayer) {
      onAdd([LAYER.id]);
      return () => onRemove([LAYER.id]);
    }
  }, [onAdd, onRemove, LAYER.id, activeLayer]);

  if (!SOURCE || !LAYER) return null;

  return (
    <Source {...SOURCE}>
      <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesLayer;
