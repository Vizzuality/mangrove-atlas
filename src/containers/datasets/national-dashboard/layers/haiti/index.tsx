import { Source, Layer } from 'react-map-gl';
import type { LayerProps, SourceProps } from 'react-map-gl';

import { nationalDashboardSettingsAtom } from 'store/national-dashboard';

import { useRecoilValue } from 'recoil';

// import type { LayerProps } from 'types/layers';

export function useSource(): SourceProps {
  return {
    id: 'national-dashboard-car_mangroves-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.dk6v2gg1',
  };
}

export function useLayers({ id, color }: { id: LayerProps['id']; color: string }): LayerProps[] {
  return [
    {
      id: `${id}-HAITI-layer`,
      source: 'national-dashboard-car_mangroves-source',
      'source-layer': 'car_mangroves',
      type: 'fill',
      paint: {
        'fill-color': color,
      },
    },
  ];
}

const MangrovesNationalDashboardLayer = ({ beforeId, id }: LayerProps) => {
  const settings = useRecoilValue(nationalDashboardSettingsAtom);
  const color = settings?.['national_dashboard_source_car_mangroves'];

  const SOURCE = useSource();
  const LAYERS = useLayers({ id, color });
  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} />
      ))}
    </Source>
  );
};

export default MangrovesNationalDashboardLayer;
