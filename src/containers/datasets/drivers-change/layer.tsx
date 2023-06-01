import { Source, Layer } from 'react-map-gl';

import { useLayers, useSource } from 'containers/datasets/drivers-change/hooks';

import type { LayerProps } from 'types/layers';

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
  const SOURCE = useSource();
  const LAYERS = useLayers();

  if (!SOURCE || !LAYERS) return null;

  // !TODO: READ id from layer manager
  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={id} id={id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesLayer;
