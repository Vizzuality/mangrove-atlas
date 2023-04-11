import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { years } from './constants';
import { useLayer, useSource } from './hooks';

const MangrovesLayer = ({ beforeId }: LayerProps) => {
  const SOURCES = useSource(years);
  const LAYER = useLayer();

  if (!SOURCES || !LAYER) return null;
  return (
    <>
      {SOURCES.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          <Layer {...LAYER} beforeId={beforeId} />
        </Source>
      ))}
    </>
  );
};

export default MangrovesLayer;
