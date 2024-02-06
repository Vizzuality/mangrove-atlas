import { Source, Layer } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesProtectedAreasLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers.find((l) => l.id === id);
  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(datasetsSettings[activeLayer]?.opacity) || 1,
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

export default MangrovesProtectedAreasLayer;
