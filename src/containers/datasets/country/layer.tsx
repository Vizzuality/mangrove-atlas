import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

export const MangrovesCountryBoundariesLayer = ({ beforeId }: LayerProps) => {
  const SOURCE = useSource();
  const LAYERS = useLayers();

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesCountryBoundariesLayer;