import { WidgetTypes } from 'types/widget';

const widgets_dev = [
  {
    name: 'National dashboard',
    slug: 'mangrove_national_dashboard',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'National and Sub-National',
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: [''],
  },
  {
    name: 'Mangrove Restoration Sites',
    slug: 'mangrove_restoration_sites',
    locationType: ['country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['restoration_sites'],
  },
] satisfies WidgetTypes[];

const widgets_prod = [
  {
    name: 'Map Style',
    slug: 'mangrove_contextual_basemaps',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: [],
  },
  {
    name: 'Allen coral atlas',
    slug: 'mangrove_allen_coral_reef',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers'],
    layersIds: ['allen_coral_reef'],
  },
  {
    ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && {
      name: 'Salt Marsh',
      slug: 'mangrove_salt_marsh',
      locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
      categoryIds: ['contextual_layers'],
    }),
  },
  {
    name: 'Tidal flats',
    slug: 'mangrove_tidal_flats',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers'],
    layersIds: ['tidal_flats'],
  },
  {
    name: 'Global tidal wetland change',
    slug: 'mangrove_global_tidal_wetland_change',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers'],
    layersIds: ['global_tidal_wetland_change'],
  },
  {
    name: 'Mangrove habitat extent',
    slug: 'mangrove_habitat_extent',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, Sub-National, and Local',
    categoryIds: ['all_datasets', 'distribution_and_change', 'restoration_and_conservation'],
    layersIds: ['extent'],
  },
  {
    name: 'Mangrove net change',
    slug: 'mangrove_net_change',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'distribution_and_change', 'restoration_and_conservation'],
    layersIds: ['net'],
  },
  {
    name: 'Mangrove habitat change',
    slug: 'mangrove_habitat_change',
    locationType: ['worldwide'],
    applicability: 'Global',
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: [],
  },
  {
    name: 'Mangrove alerts',
    slug: 'mangrove_alerts',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, Sub-National, and Local',
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'distribution_and_change'],
    layersIds: ['alerts-heat'],
    contextualLayersIds: ['45d01564-c099-42d8-b8f2-a0851accf3e7'],
  },
  {
    name: 'Species location by country',
    slug: 'mangrove_species_location',
    locationType: ['country', 'worldwide'],
    applicability: 'Global and National',
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'distribution_and_change'],
    layersIds: ['species-location'],
  },
  {
    name: 'Mangrove Species Distribution',
    slug: 'mangrove_species_distribution',
    locationType: ['country', 'worldwide'],
    applicability: 'Global and National',
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'distribution_and_change'],
    layersIds: ['species-distribution'],
  },
  {
    name: 'Mangrove species by Red List status',
    slug: 'mangrove_species_threatened',
    locationType: ['country', 'worldwide'],
    applicability: 'Global and National',
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'distribution_and_change'],
  },
  {
    name: 'Mangrove Protection',
    slug: 'mangrove_protection',
    locationType: ['country', 'worldwide'],
    applicability: '',
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
  },
  {
    name: 'Mangrove Restoration',
    slug: 'mangrove_restoration',
    locationType: ['country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['restoration'],
  },
  {
    name: 'Mangrove biomass',
    slug: 'mangrove_biomass',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['biomass'],
  },
  {
    name: 'Mangrove height',
    slug: 'mangrove_height',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['height'],
  },
  {
    name: 'Mangrove Blue Carbon',
    slug: 'mangrove_blue_carbon',
    locationType: ['custom-area', 'country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'climate_and_policy', 'ecosystem_services'],
    layersIds: ['carbon'],
  },
  {
    name: 'Mangrove Emissions Mitigation',
    slug: 'mangrove_emissions_mitigation',
    locationType: ['custom', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global and National',
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Mangrove International Status',
    slug: 'mangrove_international_status',
    locationType: ['custom', 'wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Carbon Market Potential',
    slug: 'mangrove_carbon_market_potential',
    locationType: ['country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Drivers of change',
    slug: 'mangrove_drivers_change',
    locationType: ['custom-area', 'wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['extent'],
  },
  {
    name: 'Mangrove fisheries',
    slug: 'mangrove_fisheries',
    locationType: ['custom-area', 'wdpa', 'country'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['mangrove_fisheries'],
  },
  {
    name: 'Coastal protection',
    slug: 'mangrove_flood_protection',
    locationType: ['custom-area', 'wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: [
      'mangrove_coastal_protection_area',
      'mangrove_coastal_protection_population',
      'mangrove_coastal_protection_stock',
    ],
  },
  {
    ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && {
      name: 'IUCN Ecoregion assesment',
      slug: 'mangrove_iucn_ecoregion',
      locationType: ['worldwide'],
      applicability: 'Global',
      categoryIds: ['all_datasets', 'distribution_and_change'],
      layersIds: ['ecoregion'],
    }),
  },
  {
    name: 'Draw or upload an area',
    slug: 'mangrove_drawing_tool',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: [],
  },
] satisfies WidgetTypes[];

const widgets =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
    ? [...widgets_dev, ...widgets_prod]
    : widgets_prod;
export const ANALYSIS_WIDGETS_SLUGS: WidgetTypes['slug'][] = [
  'mangrove_habitat_extent',
  'mangrove_net_change',
  'mangrove_height',
  'mangrove_biomass',
  'mangrove_alerts',
  'mangrove_blue_carbon',
];

export const MAP_SETTINGS_SLUGS: string[] = [
  'mangrove_contextual_basemaps',
  'mangrove_layer_name_second',
  'mangrove_allen_coral_reef',
  'mangrove_tidal_flats',
  'mangrove_global_tidal_wetland_change',
  'mangrove_salt_marsh',
];

export default widgets;
