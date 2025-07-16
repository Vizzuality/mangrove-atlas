import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';

import { useRecoilValue } from 'recoil';

import type { LayerProps } from 'types/layers';

import { useLayers, useSource } from './hooks';
import { useRouter } from 'next/router';

const MangrovesCommercialFisheriesProductionLayer = ({
  beforeId,
  id = 'mangrove_commercial_fisheries_production',
}: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = useMemo(() => activeLayers?.find((l) => l.id === id), [activeLayers, id]);
  const { query } = useRouter();

  const filter = useMemo(() => {
    if (query.layers) {
      try {
        return JSON.parse(query.layers as string).find((l: any) => l.id === id)?.filter;
      } catch (error) {
        console.error('Error parsing layers from query:', error);
      }
    }
    return activeLayer?.filter;
  }, [query.layers, activeLayer, id]);

  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
    indicator: filter,
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

export default MangrovesCommercialFisheriesProductionLayer;
