import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

export const PlanetSatelliteBasemapAnalyticLayer = ({ beforeId, id }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);

  const SOURCE = useSource({
    year: datasetsSettings[activeLayer]?.settings?.date,
  });
  const LAYER = useLayer({
    id,
    opacity: parseFloat(datasetsSettings[activeLayer]?.opacity) || 1,
    visibility: datasetsSettings[activeLayer]?.visibility || 'visible',
  });

  if (!SOURCE || !LAYER) return null;

  return (
    <>
      <Source {...SOURCE}>
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      </Source>
    </>
  );
};

export default PlanetSatelliteBasemapAnalyticLayer;
