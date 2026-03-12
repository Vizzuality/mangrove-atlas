import { Source, Layer } from 'react-map-gl';

import { activeLayersAtom } from '@/store/layers';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesNationalDashboardLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers?.find((l) => l.id === id);

  const SOURCE = useSource({ settings: activeLayer.settings });
  const LAYER = useLayers({
    id: activeLayer.id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
    settings: activeLayer.settings,
  });

  if (!SOURCE || !LAYER) return null;

  return (
    <Source key={`${SOURCE.id}-${SOURCE.url}`} {...SOURCE}>
      <Layer
        key={`${LAYER.id}-${activeLayer.settings.source_layer}`}
        {...LAYER}
        beforeId={beforeId}
      />
    </Source>
  );
};

export default MangrovesNationalDashboardLayer;
