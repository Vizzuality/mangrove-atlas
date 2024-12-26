import { WidgetTypes } from 'types/widget';

const widgets_dev = [
  {
    name: 'Mangrove Restoration Sites',
    slug: 'mangrove_rest_sites',
    locationType: ['country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['mangrove_rest_sites'],
  },
] satisfies WidgetTypes[];

const widgets_prod = [
  {
    name: 'National Dashboard',
    slug: 'mangrove_national_dashboard',
    locationType: ['custom-area', 'country'],
    applicability: 'National and Sub-National',
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: ['mangrove_national_dashboard'],
  },
  {
    name: 'Mangrove Habitat Extent',
    slug: 'mangrove_habitat_extent',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, Sub-National, and Local',
    categoryIds: ['all_datasets', 'distribution_and_change', 'restoration_and_conservation'],
    layersIds: ['mangrove_habitat_extent'],
  },
  {
    name: 'Mangrove Net Change',
    slug: 'mangrove_net_change',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'distribution_and_change', 'restoration_and_conservation'],
    layersIds: ['mangrove_net_change'],
  },
  {
    name: 'Mangrove Habitat Change',
    slug: 'mangrove_habitat_change',
    locationType: ['worldwide'],
    applicability: 'Global',
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: [],
  },
  {
    name: 'Mangrove Alerts',
    slug: 'mangrove_alerts',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, Sub-National, and Local',
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'distribution_and_change'],
    layersIds: ['mangrove_alerts'],
    contextualLayersIds: [],
  },
  {
    name: 'Species Location by Country',
    slug: 'mangrove_species_location',
    locationType: ['country', 'worldwide'],
    applicability: 'Global and National',
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'distribution_and_change'],
    layersIds: ['mangrove_species_location'],
  },
  {
    name: 'Mangrove Species Distribution',
    slug: 'mangrove_species_distribution',
    locationType: ['country', 'worldwide'],
    applicability: 'Global and National',
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'distribution_and_change'],
    layersIds: ['mangrove_species_distribution'],
  },
  {
    name: 'Mangrove Species by Red List Status',
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
    layersIds: ['mangrove_protection'],
  },
  {
    name: 'Mangrove Restoration',
    slug: 'mangrove_restoration',
    locationType: ['country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['mangrove_restoration'],
  },
  {
    name: 'Mangrove Biomass',
    slug: 'mangrove_biomass',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['mangrove_biomass'],
  },
  {
    name: 'Mangrove Height',
    slug: 'mangrove_height',
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['mangrove_height'],
  },
  {
    name: 'Mangrove Blue Carbon',
    slug: 'mangrove_blue_carbon',
    locationType: [
      // 'custom-area',
      'country',
      'worldwide',
    ],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'climate_and_policy', 'ecosystem_services'],
    layersIds: ['mangrove_blue_carbon'],
  },
  {
    name: 'Mangrove Emissions Mitigation',
    slug: 'mangrove_emissions_mitigation',
    locationType: ['all_datasets', 'wdpa', 'country', 'worldwide'],
    applicability: 'Global and National',
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Mangrove International Status',
    slug: 'mangrove_international_status',
    locationType: ['all_datasets', 'country'],
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
    name: 'Drivers of Change',
    slug: 'mangrove_drivers_change',
    locationType: ['wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['mangrove_drivers_change'],
  },
  {
    name: 'Mangrove Fisheries',
    slug: 'mangrove_fisheries',
    locationType: ['wdpa', 'country'],
    applicability: 'Global, National, and Sub-National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    layersIds: ['mangrove_fisheries'],
  },
  {
    name: 'Coastal Protection',
    slug: 'mangrove_flood_protection',
    locationType: ['wdpa', 'country'],
    applicability: 'National',
    categoryIds: ['all_datasets', 'ecosystem_services'],
    subLayersIds: [
      'mangrove_coastal_protection_area',
      'mangrove_coastal_protection_population',
      'mangrove_coastal_protection_stock',
    ],
  },
  ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
    ? ([
        {
          name: 'IUCN Ecosystem Red List Assessment',
          slug: 'mangrove_iucn_ecoregion',
          locationType: ['worldwide'],
          applicability: 'Global',
          categoryIds: ['all_datasets', 'distribution_and_change', 'restoration_and_conservation'],
          layersIds: ['mangrove_iucn_ecoregion'],
        },
      ] as WidgetTypes[])
    : []),
  {
    name: 'Protected Areas',
    slug: 'mangrove_protected_areas',
    locationType: ['wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers', 'all_datasets'],
    layersIds: ['mangrove_protected_areas'],
  },
  {
    name: 'Allen Coral Atlas',
    slug: 'mangrove_allen_coral_reef',
    locationType: ['wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers', 'all_datasets'],
    layersIds: ['mangrove_allen_coral_reef'],
  },
  {
    name: 'Salt Marsh',
    slug: 'mangrove_salt_marsh',
    locationType: ['wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers', 'all_datasets'],
    layersIds: ['mangrove_salt_marsh'],
  },
  {
    name: 'Tidal Flats',
    slug: 'mangrove_tidal_flats',
    locationType: ['wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers', 'all_datasets'],
    layersIds: ['mangrove_tidal_flats'],
  },
  {
    name: 'Global Tidal Wetland Change',
    slug: 'mangrove_global_tidal_wetland_change',
    locationType: ['wdpa', 'country', 'worldwide'],
    categoryIds: ['contextual_layers', 'all_datasets'],
    layersIds: ['mangrove_global_tidal_wetland_change'],
  },
  {
    name: 'Customize Widgets Deck',
    slug: 'widgets_deck_tool',
    locationType: ['wdpa', 'country', 'worldwide'],

    categoryIds: [
      'distribution_and_change',
      'ecosystem_services',
      'climate_and_polity',
      'restoration_and_conservation',
      'contextual_layers',
      'all_datasets',
    ],
  },
] satisfies WidgetTypes[];

export const widgets =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
    ? [...widgets_dev, ...widgets_prod]
    : widgets_prod;

export const ANALYSIS_WIDGETS_SLUGS: WidgetTypes['slug'][] = [
  'mangrove_habitat_extent',
  'mangrove_net_change',
  'mangrove_height',
  'mangrove_biomass',
  'mangrove_alerts',
  // 'mangrove_blue_carbon',
];

export const MAP_SETTINGS_SLUGS: string[] = ['mangrove_contextual_basemaps'];

export const WIDGETS_BY_CATEGORY = [
  {
    distribution_and_change: [
      'mangrove_national_dashboard',
      'mangrove_habitat_extent',
      'mangrove_net_change',
      'mangrove_habitat_change',
      'mangrove_alerts',
      'mangrove_species_location',
      'mangrove_species_distribution',
      'mangrove_species_threatened',
      'mangrove_iucn_ecoregion',
    ],
  },
  {
    restoration_and_conservation: [
      'mangrove_rest_sites',
      'mangrove_habitat_extent',
      'mangrove_net_change',
      'mangrove_alerts',
      'mangrove_species_location',
      'mangrove_species_distribution',
      'mangrove_species_threatened',
      'mangrove_protection',
      'mangrove_restoration',
      'mangrove_drivers_change',
      'mangrove_iucn_ecoregion',
    ],
  },
  {
    climate_and_policy: [
      'mangrove_blue_carbon',
      'mangrove_emissions_mitigation',
      'mangrove_international_status',
      'mangrove_carbon_market_potential',
    ],
  },
  {
    ecosystem_services: [
      'mangrove_biomass',
      'mangrove_height',
      'mangrove_blue_carbon',
      'mangrove_fisheries',
      'mangrove_flood_protection',
    ],
  },
  {
    contextual_layers: [
      'mangrove_protected_areas',
      'mangrove_allen_coral_reef',
      'mangrove_salt_marsh',
      'mangrove_tidal_flats',
      'mangrove_global_tidal_wetland_change',
    ],
  },
  {
    all_datasets: [
      'mangrove_national_dashboard',
      'mangrove_rest_sites',
      'mangrove_habitat_extent',
      'mangrove_net_change',
      'mangrove_habitat_change',
      'mangrove_alerts',
      'mangrove_species_location',
      'mangrove_species_distribution',
      'mangrove_species_threatened',
      'mangrove_protection',
      'mangrove_restoration',
      'mangrove_biomass',
      'mangrove_height',
      'mangrove_blue_carbon',
      'mangrove_emissions_mitigation',
      'mangrove_international_status',
      'mangrove_carbon_market_potential',
      'mangrove_drivers_change',
      'mangrove_fisheries',
      'mangrove_flood_protection',
      'mangrove_iucn_ecoregion',
      'mangrove_protected_areas',
      'mangrove_allen_coral_reef',
      'mangrove_salt_marsh',
      'mangrove_tidal_flats',
      'mangrove_global_tidal_wetland_change',
    ],
  },
];

export const LAYERS_BY_CATEGORY: { [key: string]: string[] } = {
  distribution_and_change: ['mangrove_habitat_extent', 'mangrove_net_change'],
  restoration_and_conservation: [
    'mangrove_habitat_extent',
    'mangrove_net_change',
    'mangrove_alerts',
  ],
  climate_and_policy: ['mangrove_blue_carbon'],
  ecosystem_services: ['mangrove_biomass', 'mangrove_height', 'mangrove_blue_carbon'],
  contextual_layers: ['mangrove_allen_coral_reef', 'mangrove_salt_marsh', 'mangrove_tidal_flats'],
};

export default widgets;
