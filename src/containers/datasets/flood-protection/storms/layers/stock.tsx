import { Source, Layer } from 'react-map-gl';
import type { SourceProps, LayerProps } from 'react-map-gl';

import { floodStockPeriodAtom } from 'store/widgets/flood-protection';

import { useRecoilValue } from 'recoil';

import { useMangrovesFloodProtection } from '../hooks';

export function useSource(): SourceProps {
  return {
    id: 'Coastal_protection_stock',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.1j82fo12',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  const period = useRecoilValue(floodStockPeriodAtom);
  const { data } = useMangrovesFloodProtection({
    period,
    indicator: 'stock',
  });

  if (!data || !data?.data?.length) return null;
  const { max, min } = data;
  return [
    {
      id,
      'source-layer': 'coastal_protection_map',
      filter: ['has', `${period}_stock`],
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', `${period}_stock`],
          min,
          '#D1EEEA',
          max,
          '#2A5674',
        ],
        'fill-opacity': 0.8,
      },
    },
  ];
}

const MangrovesFloodProtectionStockLayer = ({ beforeId, id }: LayerProps) => {
  const SOURCE = useSource();
  const LAYERS = useLayers({ id });

  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesFloodProtectionStockLayer;
