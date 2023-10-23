import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { LayerProps } from 'types/layers';

import { useLayer, useSources } from './hooks';

export const NetChangeLayer = ({ beforeId, id }: LayerProps) => {
  const SOURCES = useSources();
  const LAYER = useLayer({ id });

  if (!SOURCES || !LAYER) return null;
  return (
    <>
      {SOURCES.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
        </Source>
      ))}
    </>
  );
};

export default NetChangeLayer;
