import type { ContextualBasemapsId, MosaicId } from 'types/widget';

type ContextualLayersTypes = Array<{
  id: ContextualBasemapsId;
  type: 'contextual-basemap';
  mosaic_id: MosaicId;
  name: string;
  basemap_type: 'Visual' | 'Analytic';
  monitoring_frequency: 'Monthly' | 'Biannual';
  description: string;
  hasDropdown: boolean;
}>;
export const CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES = [
  {
    id: 'planet_medres_visual_monthly',
    type: 'contextual-basemap',
    mosaic_id: '45d01564-c099-42d8-b8f2-a0851accf3e7',
    name: 'PS Tropical Visual Monthly Monitoring',
    basemap_type: 'Visual',
    monitoring_frequency: 'Monthly',
    description: 'Monthly hight resolution basemaps (tropics)',
    hasDropdown: true,
  },
  // {
  //   id: 'b55b46db-40cc-4432-b4dd-705ac40b2a16',
  //   name: 'PS Tropical Visual Biannual Archive',
  //   basemap_type: 'Visual',
  //   monitoring_frequency: 'Biannual',
  //   description: 'Biannual hight resolution basemaps (tropics)',
  // },
  {
    id: 'planet_medres_analytic_monthly',
    type: 'contextual-basemap',
    mosaic_id: 'be1f8e5e-6a29-4d27-8542-1fdb664fd78e',
    name: 'PS Tropical Normalized Analytic Monthly Monitoring',
    basemap_type: 'Analytic',
    monitoring_frequency: 'Monthly',
    description: 'Monthly hight resolution basemaps (tropics)',
    hasDropdown: true,
  },
  // {
  //   id: '1725ab80-8e12-4b3c-9c25-99550eb466e4',
  //   name: 'PS Tropical Normalized Analytic Biannual Archive',
  //   basemap_type: 'Analytic',
  //   monitoring_frequency: 'Biannual',
  //   description: 'Biannual hight resolution basemaps (tropics)',
  // },
] satisfies ContextualLayersTypes;
// TO - DO - Check use case for periodic basemaps
