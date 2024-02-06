import { Source, Layer } from 'react-map-gl';

import { useSyncDatasetsSettings, useSyncLayers } from 'lib/utils/sync-query';

import type { LayerProps } from 'types/layers';

import { useLayers, useSources } from './hooks';

const MangrovesAlertsLayer = ({ beforeId, id }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);
  const SOURCES = useSources();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(datasetsSettings[activeLayer].opacity),
    visibility: datasetsSettings[activeLayer].visibility,
  });

  if (!SOURCES || !LAYERS) return null;

  return SOURCES.map((SOURCE) => (
    <Source key={SOURCE.id} {...SOURCE}>
      {LAYERS[SOURCE.id].map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  ));
};

export default MangrovesAlertsLayer;
