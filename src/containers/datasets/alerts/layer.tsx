import React from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncDatasetsSettings, useSyncLayers } from 'lib/utils/sync-query';

import type { Visibility } from 'mapbox-gl';

import type { LayerProps } from 'types/layers';

import { useLayers, useSources } from './hooks';

type MangrovesAlertsLayers = 'alerts-heatmap' | 'alerts-tiles' | 'monitored-alerts';

const MangrovesAlertsLayer: React.FC<LayerProps> = ({ beforeId, id }) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);
  const startDate = datasetsSettings?.['mangrove_alerts']?.startDate;
  const endDate = datasetsSettings?.['mangrove_alerts']?.endDate;

  const SOURCES = useSources({ startDate, endDate });
  const LAYERS: Record<MangrovesAlertsLayers, LayerProps>[] = useLayers({
    id,
    opacity: datasetsSettings?.[activeLayer]?.opacity ?? 1, // Provide a fallback opacity if undefined
    visibility: datasetsSettings?.[activeLayer]?.visibility,
  });

  if (!SOURCES || Object.keys(LAYERS).length === 0) return null;

  return (
    <>
      {SOURCES.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          {LAYERS[SOURCE.id]?.map((LAYER) => (
            <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
          ))}
        </Source>
      ))}
    </>
  );
};

export default MangrovesAlertsLayer;
