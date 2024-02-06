import { Source, Layer } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import type { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangrovesBiomassLayer = ({ beforeId, id }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);
  const SOURCE = useSource();
  const LAYER = useLayer({
    id,
    opacity: parseFloat(datasetsSettings[activeLayer]?.opacity) || 1,
    visibility: activeLayer.visibility,
  });

  if (!SOURCE || !LAYER) return null;
  return (
    <Source {...SOURCE}>
      <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesBiomassLayer;
