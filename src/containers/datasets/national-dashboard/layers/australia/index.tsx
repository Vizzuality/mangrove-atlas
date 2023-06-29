import { Source, Layer } from 'react-map-gl';
import type { LayerProps, SourceProps } from 'react-map-gl';

import { nationalDashboardSettingsAtom } from 'store/national-dashboard';

import { useRecoilValue } from 'recoil';

// import type { LayerProps } from 'types/layers';

export function useSource(): SourceProps {
  return {
    id: 'national-dashboard-AUS-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.atkcyrph',
  };
}

export function useLayers({ id, color }: { id: LayerProps['id']; color: string }): LayerProps[] {
  return [
    {
      id: `${id}-AUS-layer`,
      source: 'national-dashboard-AUS-source',
      'source-layer': 'AUS_mangrove_cover_2022',
      type: 'fill',
      paint: {
        'fill-color': color,
      },
    },
  ];
}

const MangrovesNationalDashboardLayer = ({ beforeId, id }: LayerProps) => {
  const settings = useRecoilValue(nationalDashboardSettingsAtom);
  const color = settings?.['national_dashboard_source_AUS_mangrove_cover_2022'];

  const SOURCE = useSource();
  const LAYERS = useLayers({ id, color });
  if (!SOURCE || !LAYERS) return null;

  return (
    <Source {...SOURCE}>
      {LAYERS.map((LAYER) => (
        <Layer key={LAYER.id} {...LAYER} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesNationalDashboardLayer;
