import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangrovesSpeciesDistributionLayer = ({ beforeId }: LayerProps) => {
  const SOURCE = useSource();
  const LAYER = useLayer();

  if (!SOURCE || !LAYER) return null;
  return (
    <Source {...SOURCE}>
      <Layer {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesSpeciesDistributionLayer;
