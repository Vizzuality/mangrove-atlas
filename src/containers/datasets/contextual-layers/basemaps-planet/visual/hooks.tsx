import type { SourceProps, LayerProps } from 'react-map-gl';

import { basemapContextualVisualMonthlyDateAtom } from 'store/map-settings';

import { useRecoilValue } from 'recoil';

import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

export function useSource(): SourceProps & { key: string } {
  const date = useRecoilValue(basemapContextualVisualMonthlyDateAtom);
  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(
    'be1f8e5e-6a29-4d27-8542-1fdb664fd78e'
  );
  const selectedDate =
    (date && date?.value) || (dates?.length && dates?.[dates?.length - 1]?.value);
  return {
    id: 'planet_medres_visual_monthly',
    key: `planet_medres_visual_monthly-${selectedDate}`,
    type: 'raster',
    tiles: [
      `/planet/planet_medres_visual_${encodeURIComponent(selectedDate)}_mosaic/gmap/{z}/{x}/{y}`,
    ],
    minzoom: 0,
    maxzoom: 12,
  };
}

export function useLayer({ id }: { id: LayerProps['id'] }): LayerProps {
  return {
    id,
    type: 'raster',
  };
}
