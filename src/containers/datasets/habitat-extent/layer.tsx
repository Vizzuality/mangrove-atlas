import { Source, Layer } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource, useMangroveHabitatExtent } from './hooks';

const MangrovesHabitatExtentLayer = ({ beforeId, id }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);
  const year = datasetsSettings[activeLayer]?.year || '2020';
  const { data } = useMangroveHabitatExtent({ year });
  const years = data?.years?.sort() || [];

  const currentYear = year || years[years.length - 1];

  const SOURCE = useSource();
  const LAYERS = useLayers({
    year: currentYear,
    id,
    opacity: datasetsSettings[activeLayer]?.opacity,
    visibility: activeLayer.visibility,
  });
  if (!SOURCE || !LAYERS) return null;
  return (
    <Source key={SOURCE.id} {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesHabitatExtentLayer;
