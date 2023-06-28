import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesNationalDashboardLayer = ({
  beforeId,
  id,
  settings,
}: LayerProps & { settings: unknown }) => {
  const SOURCE = useSource({ settings });
  const LAYERS = useLayers({ id, settings });
  if (!SOURCE || !LAYERS) return null;
  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesNationalDashboardLayer;
