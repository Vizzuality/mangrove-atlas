import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangroveGlobalTidalWetlandChangeLayer = ({ beforeId, id }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);
  const SOURCE = useSource();
  const LAYER = useLayer({
    id,
  opacity: datasetsSettings[activeLayer]?.opacity,
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
