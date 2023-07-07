import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
  const year = 2020;
  const SOURCE = useSource();
  const LAYERS = useLayers({ year, id });
  if (!SOURCE || !LAYERS) return null;

  console.log(beforeId);

  return (
    <Source key={SOURCE.id} {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesLayer;
