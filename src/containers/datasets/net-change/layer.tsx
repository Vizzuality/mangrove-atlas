import React from 'react';

import { Source, Layer, SourceProps } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

export const NetChangeLayer = ({ beforeId, id }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);

  const SOURCES = useSource() satisfies SourceProps;
  const LAYER = useLayer({
    id,
    opacity: parseFloat(datasetsSettings[activeLayer]?.opacity) || 1,
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
