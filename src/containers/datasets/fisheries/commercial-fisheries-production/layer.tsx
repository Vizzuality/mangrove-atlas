import { useMemo } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';

import type { LayerProps } from 'types/layers';

import { useLayer, useSource } from './hooks';

const MangrovesCommercialFisheriesProductionLayer = ({
  beforeId,
  id = 'mangrove_commercial_fisheries_production',
}: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = useMemo(() => activeLayers?.find((l) => l.id === id), [activeLayers, id]);

  const filter = useMemo(() => {
    const f = activeLayer?.filter;
    return f === 'total' ? undefined : f;
  }, [activeLayer]);

  const SOURCE = useSource({ filter });
  const LAYERS = useLayer({
    id: `${id}-${filter || 'finfish'}`,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source key={`${SOURCE.id}-${SOURCE.tiles?.[0] ?? ''}`} {...SOURCE}>
      <Layer {...LAYERS} beforeId={beforeId} />
    </Source>
  );
};

export default MangrovesCommercialFisheriesProductionLayer;
