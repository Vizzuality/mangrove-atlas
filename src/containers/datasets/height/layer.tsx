import { Source, Layer } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import { years } from './constants';
import { useLayer, useSource } from './hooks';

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const SOURCE = useSource(years);
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!SOURCE || !LAYER) return null;
  return (
    <Source {...SOURCE}>
      <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesLayer;
