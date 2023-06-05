import type { SourceProps, LayerProps } from 'react-map-gl';

export function useSource(): SourceProps {
  const date = '2023-05';
  return {
    id: 'planet_medres_analytic_monthly',
    // id: 'be1f8e5e-6a29-4d27-8542-1fdb664fd78e',
    type: 'raster',
    tiles: [`/planet/planet_medres_normalized_analytic_${date}_mosaic/gmap/{z}/{x}/{y}`],
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
