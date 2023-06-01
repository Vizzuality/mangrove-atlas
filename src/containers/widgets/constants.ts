import { WidgetTypes } from 'types/widget';

const widgets = [
  {
    name: 'Mangrove habitat extent',
    slug: 'mangrove_habitat_extent',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: ['extent'],
  },
  {
    name: 'Mangrove net change',
    slug: 'mangrove_net_change',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: ['net'],
  },
  {
    name: 'Mangrove habitat change',
    slug: 'mangrove_habitat_change',
    locationType: ['worldwide'],
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: [],
  },
  {
    name: 'Mangrove alerts',
    slug: 'mangrove_alerts',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['alerts-heat'],
  },
  {
    name: 'Species location',
    slug: 'mangrove_species_location',
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['species-location'],
  },
  {
    name: 'Mangrove Species Distribution',
    slug: 'mangrove_species_distribution',
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['species-distribution'],
  },
  {
    name: 'Mangrove Species Threatened',
    slug: 'mangrove_species_threatened',
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
  },
  {
    name: 'Mangrove Protection',
    slug: 'mangrove_protection',
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
  },
  {
    name: 'Mangrove Restoration',
    slug: 'mangrove_restoration',
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'ecosystem_services'],
    layersIds: ['restoration'],
  },
  {
    name: 'Mangrove biomass',
    slug: 'mangrove_biomass',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'ecosystem_services'],
    layersIds: ['biomass'],
  },
  {
    name: 'Mangrove height',
    slug: 'mangrove_height',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'ecosystem_services'],
    layersIds: ['height'],
  },
  {
    name: 'Mangrove Blue Carbon',
    slug: 'mangrove_blue_carbon',
    locationType: ['custom-area', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'climate_and_policy', 'ecosystem_services'],
    layersIds: ['carbon'],
  },
  {
    name: 'Mangrove Emissions Mitigation',
    slug: 'mangrove_emissions_mitigation',
    locationType: ['custom', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Mangrove International Status',
    slug: 'mangrove_international_status',
    locationType: ['custom', 'wdpa', 'country'],
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Carbon Market Potential',
    slug: 'mangrove_carbon_market_potential',
    locationType: ['country'],
    categoryIds: ['all_datasets', 'climate_and_policy'],
    layersIds: [],
  },
  {
    name: 'Draw or upload an area',
    slug: 'mangrove_drawing_tool',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: [],
    layersIds: [],
  },
] satisfies WidgetTypes[];

export const ANALYSIS_WIDGETS_SLUGS: WidgetTypes['slug'][] = [
  'mangrove_habitat_extent',
  'mangrove_net_change',
  'mangrove_height',
  'mangrove_biomass',
  //  'mangrove_blue_carbon',  // todo:  put back when API calculations get fixed
];

export default widgets;
