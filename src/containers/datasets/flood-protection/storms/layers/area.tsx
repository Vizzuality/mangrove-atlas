import { Source, Layer } from 'react-map-gl';
import type { SourceProps, LayerProps } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import { floodAreaPeriodAtom } from 'store/widgets/flood-protection';

import { Visibility } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import { useMangrovesFloodProtection } from 'containers/datasets/flood-protection/hooks';
export function useSource(): SourceProps {
  return {
    id: 'Coastal_protection_area',
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
  const period = useRecoilValue(floodAreaPeriodAtom);
  const selectedPeriod = period || 'annual';
  const { data } = useMangrovesFloodProtection(selectedPeriod, {
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
        'fill-opacity': opacity * 0.7,
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
      layout: {
        visibility,
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
      layout: {
        visibility,
      },
    },
  ];
}

const MangrovesFloodProtectionLayer = ({ beforeId, id }: LayerProps) => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();
  const activeLayer = layers.find((l) => l === id);
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

export default MangrovesFloodProtectionLayer;
