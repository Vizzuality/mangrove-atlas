import { WidgetSlugType, WidgetTypes } from 'types/widget';
const widgets = [
  {
    name: 'Mangrove habitat extent',
    slug: 'mangrove_habitat_extent' satisfies WidgetSlugType,
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: ['extent'],
  },
  {
    name: 'Mangrove net change',
    slug: 'mangrove_net_change' satisfies WidgetSlugType,
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: ['net'],
  },
  {
    name: 'Mangrove habitat change',
    slug: 'mangrove_habitat_change' satisfies WidgetSlugType,
    locationType: ['worldwide'],
    categoryIds: ['all_datasets', 'distribution_and_change'],
    layersIds: [],
  },
  {
    name: 'Mangrove alerts',
    slug: 'mangrove_alerts' satisfies WidgetSlugType,
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
    layersIds: ['alerts-heat'],
  },
  {
    name: 'Species location',
    slug: 'mangrove_species_location' satisfies WidgetSlugType,
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
  },
  {
    name: 'Mangrove Species Distribution',
    slug: 'mangrove_species_distribution' satisfies WidgetSlugType,
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
  },
  {
    name: 'Mangrove Species Threatened',
    slug: 'mangrove_species_threatened' satisfies WidgetSlugType,
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
  },
  {
    name: 'Mangrove Protection',
    slug: 'mangrove_protection' satisfies WidgetSlugType,
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation'],
  },
  {
    name: 'Mangrove Restoration',
    slug: 'mangrove_restoration' satisfies WidgetSlugType,
    locationType: ['country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'ecosystem_services'],
    layersIds: ['restoration'],
  },
  {
    name: 'Mangrove biomass',
    slug: 'mangrove_biomass' satisfies WidgetSlugType,
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'ecosystem_services'],
    layersIds: ['biomass'],
  },
  {
    name: 'Mangrove height',
    slug: 'mangrove_height' satisfies WidgetSlugType,
    locationType: ['custom-area', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'restoration_and_conservation', 'ecosystem_services'],
    layersIds: ['height'],
  },
  {
    name: 'Mangrove Blue Carbon',
    slug: 'mangrove_blue_carbon' satisfies WidgetSlugType,
    locationType: ['custom-area', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'climate_and_policy', 'ecosystem_services'],
    layersIds: ['carbon'],
  },
  {
    name: 'Mangrove Emissions Mitigation',
    slug: 'mangrove_emissions_mitigation' satisfies WidgetSlugType,
    locationType: ['custom', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Mangrove International Status',
    slug: 'mangrove_international_status' satisfies WidgetSlugType,
    locationType: ['custom', 'wdpa', 'country', 'worldwide'],
    categoryIds: ['all_datasets', 'climate_and_policy'],
  },
  {
    name: 'Carbon Market Potential',
    slug: 'mangrove_investment_potential' satisfies WidgetSlugType,
    locationType: ['country'],
    categoryIds: ['all_datasets', 'climate_and_policy'],
    layersIds: [],
  },
  // {
  //   name: 'Mangrove coverage',
  //   slug: 'mangrove_coverage' satisfies WidgetSlugType,
  //   locationType: [''],
  //   categoryIds: ['all_datasets', 'distribution_and_change'],
  //   layersIds: ['coverage-1996-2016'],
  // },
] satisfies WidgetTypes[];

export default widgets;