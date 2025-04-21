import { Source, Layer } from 'react-map-gl';

import { useRecoilState } from 'recoil';

import { activeLayersAtom } from 'store/layers';
import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';

const MangrovesNationalDashboardLayer = ({ beforeId, id }: LayerProps) => {
  const [activeLayers] = useRecoilState(activeLayersAtom);
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const SOURCE = useSource({ settings: activeLayer.settings });
  const LAYER = useLayers({
    id: 'mangrove_national_dashboard_layer',
    opacity: parseFloat(activeLayer?.opacity),
    visibility: activeLayer.visibility,
    settings: activeLayer.settings,
  });
  if (!SOURCE || !LAYER) return null;

  return (
    <Source {...SOURCE}>
      <Layer key={LAYER.id} id={SOURCE.id} {...LAYER} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesNationalDashboardLayer;
