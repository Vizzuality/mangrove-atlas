import { Source, Layer } from 'react-map-gl';

import { LayerProps } from 'types/layers';

import { Settings } from 'components/map/legend/types';

import { useLayer, useSource } from './hooks';

const MangrovesLayer = ({ settings, beforeId }: LayerProps<Settings>) => {
  const SOURCE = useSource();
  const LAYER = useLayer({ settings });

  if (!SOURCE || !LAYER) return null;

  return (
    <Source {...SOURCE}>
      <Layer {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesLayer;