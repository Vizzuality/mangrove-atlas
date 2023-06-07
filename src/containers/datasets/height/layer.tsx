import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { years } from './constants';
import { useLayer, useSource } from './hooks';

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
  const SOURCE = useSource(years);
  const LAYER = useLayer({ id });

  if (!SOURCE || !LAYER) return null;
  return (
    <Source {...SOURCE}>
      <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesLayer;
