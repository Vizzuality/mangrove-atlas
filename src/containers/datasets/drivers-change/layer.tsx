import { Source, Layer } from 'react-map-gl';

import { useLayers, useSource } from 'containers/datasets/drivers-change/hooks';

import type { LayerProps } from 'types/layers';

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
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

export default MangrovesLayer;