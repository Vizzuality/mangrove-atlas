import React from 'react';

import { Source, Layer, SourceProps } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';

import { useRecoilValue } from 'recoil';

import { LayerProps } from 'types/layers';

import { useLayer, useSources } from './hooks';

export const NetChangeLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers.find((l) => l.id === id);

  const sourceLoss = useSources('loss') satisfies SourceProps[];
  const sourceGain = useSources('gain') satisfies SourceProps[];
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!LAYER || !sourceLoss || !sourceGain) return null;

  const SOURCES = [...sourceGain, ...sourceLoss];

  return (
    <>
      {SOURCES.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          <Layer key={`${SOURCE.id}-layer`} {...LAYER} id={SOURCE.id} beforeId={beforeId} />
        </Source>
      ))}
    </>
  );
};

export default NetChangeLayer;
