import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { useLayers, useSources } from './hooks';

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
  const SOURCES = useSources();
  const LAYERS = useLayers({ id });

  if (!SOURCES || !LAYERS) return null;
  return SOURCES.map((SOURCE) => (
    <Source key={SOURCE.id} {...SOURCE}>
      {LAYERS[SOURCE.id].map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  ));
};

export default MangrovesLayer;
