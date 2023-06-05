import type { SourceProps, LayerProps } from 'react-map-gl';

import { basemapContextualVisualMonthlyDateAtom } from 'store/map-settings';

import { useRecoilValue } from 'recoil';

export function useSource(): SourceProps & { key: string } {
  const date = useRecoilValue(basemapContextualVisualMonthlyDateAtom);

  return {
    id: 'planet_medres_visual_monthly',
    key: `planet_medres_visual_monthly-${date.label}`,
    type: 'raster',
    tiles: [
      `/planet/planet_medres_visual_${encodeURIComponent(date.value)}_mosaic/gmap/{z}/{x}/{y}`,
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
