import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangrovesSaltMarshLayer = ({ beforeId, id }: LayerProps) => {
  const SOURCE = useSource();
  const LAYER = useLayer({ id });

  if (!SOURCE || !LAYER) return null;

  return (
    <Source {...SOURCE}>
      <Layer {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesSaltMarshLayer;
