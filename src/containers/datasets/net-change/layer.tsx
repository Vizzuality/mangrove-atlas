import React from 'react';

import { Source, Layer, SourceProps } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';

import { useRecoilValue } from 'recoil';

import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

export const NetChangeLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers.find((l) => l.id === id);

  const SOURCES = useSource() satisfies SourceProps;
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!SOURCES || !LAYER) return null;

  return (
    <>
      <Source key={SOURCES.id} {...SOURCES}>
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      </Source>
    </>
  );
};

export default NetChangeLayer;
