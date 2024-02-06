import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesProtectedAreasLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);
  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
  opacity: datasetsSettings[activeLayer]?.opacity,
    visibility: activeLayer.visibility,
  });

  useEffect(() => {
    const ids = LAYERS.map((layer) => layer.id);
    onAdd(ids);
    return () => onRemove(ids);
  }, [onAdd, onRemove]);

  if (!SOURCE || !LAYERS) return null;
  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesProtectedAreasLayer;
