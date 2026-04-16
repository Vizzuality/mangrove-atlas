import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangrovesAllenCoralReefLayer = ({ beforeId, id }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const SOURCE = useSource();
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!SOURCE || !LAYER) return null;

  return (
    <Source {...SOURCE}>
      <Layer {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesAllenCoralReefLayer;
