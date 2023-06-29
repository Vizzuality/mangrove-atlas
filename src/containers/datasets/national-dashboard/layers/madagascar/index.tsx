import { Source, Layer } from 'react-map-gl';
import type { LayerProps, SourceProps } from 'react-map-gl';

import { nationalDashboardSettingsAtom } from 'store/national-dashboard';

import { useRecoilValue } from 'recoil';

// import type { LayerProps } from 'types/layers';

export function useSource(): SourceProps {
  return {
    id: 'national-dashboard-MADAGASCAR-source',
    type: 'vector',
    url: 'globalmangrovewatch.4ifqc3wd',
  };
}

export function useLayers({ id, color }: { id: LayerProps['id']; color: string }): LayerProps[] {
  return [
    {
      id: `${id}-MADAGASCAR-layer`,
      source: 'national-dashboard-MADAGASCAR-source',
      'source-layer': 'MangroveExtent2020MadagascarFinalQAv3',
      type: 'fill',
      paint: {
        'fill-color': color,
      },
    },
  ];
}

const MangrovesNationalDashboardLayer = ({ beforeId, id }: LayerProps) => {
  const settings = useRecoilValue(nationalDashboardSettingsAtom);
  const color = settings?.['national_dashboard_source_MangroveExtent2020MadagascarFinalQAv3'];

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
