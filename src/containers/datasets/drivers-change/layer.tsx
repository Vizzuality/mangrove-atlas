import { Source, Layer } from 'react-map-gl';

import { useRecoilValue } from 'recoil';

import { useLayers, useSource } from 'containers/datasets/drivers-change/hooks';
import { activeLayersAtom } from 'store/layers';
import type { LayerProps } from 'types/layers';

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesLayer;
