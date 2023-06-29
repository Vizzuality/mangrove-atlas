import { Source, Layer } from 'react-map-gl';
import type { SourceProps, LayerProps } from 'react-map-gl';

import { floodAreaPeriodAtom } from 'store/widgets/flood-protection';

import { useRecoilValue } from 'recoil';

import { useMangrovesFloodProtection } from '../hooks';
export function useSource(): SourceProps {
  return {
    id: 'Coastal_protection_area',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.1j82fo12',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  const period = useRecoilValue(floodAreaPeriodAtom);
  const { data } = useMangrovesFloodProtection(period, {
    indicator: 'area',
  });

  if (!data || !data?.data?.length) return null;
  const { max, min } = data;
  return [
    {
      id,
      'source-layer': 'coastal_protection_map',
      filter: ['has', `${period}_area`],
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', `${period}_area`],
          min,
          '#F3E0F7',
          max,
          '#63589F',
        ],
        'fill-opacity': 0.7,
        'fill-outline-color': [
          'interpolate',
          ['linear'],
          ['get', `${period}_area`],
          min,
          '#F3E0F7',
          max,
          '#63589F',
        ],
      },
    },
    {
      id: `${id}-line`,
      'source-layer': 'coastal_protection_map',
      filter: ['has', `${period}_area`],
      type: 'line',
      paint: {
        'line-color': [
          'interpolate',
          ['linear'],
          ['get', `${period}_area`],
          min,
          '#F3E0F7',
          max,
          '#63589F',
        ],
      },
    },
  ];
}

const MangrovesFloodProtectionLayer = ({ beforeId, id }: LayerProps) => {
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

export default MangrovesFloodProtectionLayer;
