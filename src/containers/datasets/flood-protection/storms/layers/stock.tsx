import { Source, Layer } from 'react-map-gl';
import type { SourceProps, LayerProps } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';
import { floodStockPeriodAtom } from 'store/widgets/flood-protection';

import { Visibility } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import { useMangrovesFloodProtection } from 'containers/datasets/flood-protection/hooks';

export function useSource(): SourceProps {
  return {
    id: 'Coastal_protection_stock',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.1j82fo12',
  };
}

export function useLayers({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  const period = useRecoilValue(floodStockPeriodAtom);
  const { data } = useMangrovesFloodProtection(period, {
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
        'fill-opacity': opacity * 0.8,
      },
      layout: {
        visibility,
      },
    },
  ];
}

const MangrovesFloodProtectionStockLayer = ({ beforeId, id }: LayerProps) => {
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

export default MangrovesFloodProtectionStockLayer;
