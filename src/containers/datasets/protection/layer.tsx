import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesProtectedAreasLayer = ({ beforeId, id }: LayerProps) => {
  const SOURCE = useSource();
  const LAYERS = useLayers({ id });

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
