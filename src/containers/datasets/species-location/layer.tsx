import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangrovesSpeciesLocationLayer = ({ beforeId }: LayerProps) => {
  const SOURCE = useSource();
  const LAYERS = useLayer();

  if (!SOURCE || !LAYERS) return null;
  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesSpeciesLocationLayer;
