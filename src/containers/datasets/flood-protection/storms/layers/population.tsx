import { Source, Layer } from 'react-map-gl';
import type { SourceProps, LayerProps } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';
import { floodPopulationPeriodAtom } from 'store/widgets/flood-protection';

import { Visibility } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import { useMangrovesFloodProtection } from 'containers/datasets/flood-protection/hooks';

export function useSource(): SourceProps {
  return {
    id: 'Coastal_protection_population',
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
        'fill-opacity': opacity * 0.6,
      },
      layout: {
        visibility,
      },
    },
  ];
}

const MangrovesFloodProtectionPopulationLayer = ({ beforeId, id }: LayerProps) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const activeLayer = activeLayers.find((l) => l.id === id);

  const SOURCE = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
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

export default MangrovesFloodProtectionPopulationLayer;
