import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { LayerProps } from 'types/layers';

import { years } from './constants';
import { useLayer, useSources } from './hooks';

export const MangrovesLayer = ({ beforeId }: LayerProps) => {
  const SOURCES = useSources(years);
  const LAYER = useLayer();

  if (!SOURCES || !LAYER) return null;

  return (
    <>
      {SOURCES.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          <Layer {...LAYER} beforeId={beforeId} />
        </Source>
      ))}
    </>
  );
};

export default MangrovesLayer;
