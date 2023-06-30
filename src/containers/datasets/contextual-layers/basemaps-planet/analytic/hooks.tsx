import type { SourceProps, LayerProps } from 'react-map-gl';

import { basemapContextualAnalyticMonthlyDateAtom } from 'store/map-settings';

import { useRecoilValue } from 'recoil';

import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

export function useSource(): SourceProps & { key: string } {
  const date = useRecoilValue(basemapContextualAnalyticMonthlyDateAtom);
  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(
    '45d01564-c099-42d8-b8f2-a0851accf3e7'
  );
  const selectedDate = date?.value || dates?.[dates?.length - 1]?.value;

  return {
    id: 'planet_medres_analytic_monthly',
    key: `planet_medres_analytic_monthly-${date?.label}`,
    type: 'raster',
    tiles: [
      `/planet/planet_medres_normalized_analytic_${encodeURIComponent(
        selectedDate
      )}_mosaic/gmap/{z}/{x}/{y}`,
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
