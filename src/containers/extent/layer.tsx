import { Source, Layer } from 'react-map-gl';

import type { LayerProps } from 'types/layers';

import { years } from './constants';
import { useLayer, useSources } from './hooks';

const MangrovesLayer = ({ beforeId }: LayerProps) => {
  const SOURCES = useSources(years);
  const LAYER = useLayer(years);

  if (!SOURCES || !LAYER) return null;
  return (
    <>
      {SOURCES.map((SOURCE) => (
        <Source key={SOURCE.id} {...SOURCE}>
          {/* <Layer {...LAYER} beforeId={beforeId} /> */}
        </Source>
      ))}
    </>
  );
};

export default MangrovesLayer;
