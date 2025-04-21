import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { useRecoilValue } from 'recoil';

import { activeLayersAtom } from 'store/layers';
import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangroveGlobalTidalWetlandChangeLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
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

export default MangroveGlobalTidalWetlandChangeLayer;
