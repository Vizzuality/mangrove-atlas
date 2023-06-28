import { Source, Layer } from 'react-map-gl';
import type { SourceProps, LayerProps } from 'react-map-gl';

import { floodPopulationPeriodAtom } from 'store/widgets/flood-protection';

import { useRecoilValue } from 'recoil';

import { useMangrovesFloodProtection } from '../hooks';

export function useSource(): SourceProps {
  return {
    id: 'Coastal_protection_population',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.1j82fo12',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  const period = useRecoilValue(floodPopulationPeriodAtom);
  const { data } = useMangrovesFloodProtection(period, {
    indicator: 'population',
  });

  if (!data || !data?.data?.length) return null;
  const { max, min } = data;
  return [
    {
      id,
      'source-layer': 'coastal_protection_map',
      filter: ['has', `${period}_population`],
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', `${period}_population`],
          min,
          '#FFC6C4',
          max,
          '#672044',
        ],
      },
    },
  ];
}

const MangrovesFloodProtectionPopulationLayer = ({ beforeId, id }: LayerProps) => {
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

export default MangrovesFloodProtectionPopulationLayer;
