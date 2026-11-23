import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import type { LayerProps } from 'types/layers';

import { years } from './constants';
import { useLayer, useSource } from './hooks';

// The widget reports the latest year, so the map shows the same one.
const LATEST_YEAR = Math.max(...years);

const MangrovesLayer = ({ beforeId, id }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const SOURCE = useSource(LATEST_YEAR);
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
