import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const PlanetSatelliteBasemapAnalyticLayer = ({ beforeId, id }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);

  const SOURCE = useSource({
    year: activeLayer.settings?.date,
  });
  const LAYER = useLayer({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!SOURCE || !LAYER) return null;

  return (
    <>
      <Source {...SOURCE}>
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      </Source>
    </>
  );
};

export default PlanetSatelliteBasemapAnalyticLayer;
