import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

export const LAYERS = [
  {
    name: 'IUCN Ecosystem assessment',
    id: 'mangrove_iucn_ecoregion',
  },
  {
    name: 'Protected areas',
    id: 'mangrove_protected_areas',
  },
  {
    name: 'Coastal protection: area',
    id: 'mangrove_coastal_protection_area',
  },
  {
    name: 'Coastal protection: population',
    id: 'mangrove_coastal_protection_population',
  },
  {
    name: 'Coastal protection: stock',
    id: 'mangrove_coastal_protection_stock',
  },
  {
    name: 'Mangrove Blue Carbon',
    id: 'mangrove_blue_carbon',
  },
  {
    name: 'Height canopy',
    id: 'mangrove_height',
  },
  {
    name: 'Mangrove biomass',
    id: 'mangrove_biomass',
  },
  {
    name: 'Restoration Sites',
    id: 'mangrove_rest_sites',
  },
  {
    name: 'Mangrove restoration',
    id: 'mangrove_restoration',
  },
  {
    name: 'Mangrove protected areas',
    id: 'mangrove_protection',
  },
  {
    name: 'Species location',
    id: 'mangrove_species_location',
  },
  {
    name: 'Species distribution',
    id: 'mangrove_species_distribution',
  },
  {
    name: 'Mangrove deforestation alerts',
    id: 'mangrove_alerts',
  },
  {
    name: 'Mangrove change',
    id: 'mangrove_net_change',
  },
  {
    name: 'Mangrove drivers of change',
    id: 'mangrove_drivers_change',
  },
  {
    name: 'Mangrove fisheries',
    id: 'mangrove_fisheries',
  },
  {
    name: 'Mangrove extent',
    id: 'mangrove_habitat_extent',
  },
  {
    name: 'Custom analysis',
    id: 'custom-area',
  },
  {
    name: 'Digital Earth Australia',
    id: 'national_dashboard_source_AUS_mangrove_cover_2022',
  },
  {
    name: 'Save Our Mangroves Now project',
    id: 'national_dashboard_source_MangroveExtent2020MozambiqueFinalQAv2',
  },

  {
    name: 'Allen coral atlas',
    id: 'mangrove_allen_coral_reef',
  },
  {
    name: 'Global intertidal wetland change',
    id: 'mangrove_global_tidal_wetland_change',
  },
  {
    name: 'Tidal flats',
    id: 'mangrove_tidal_flats',
  },
  {
    name: 'Global Tidal Marsh Distribution',
    id: 'mangrove_salt_marsh',
  },
];

export const LAYERS_ORDER = [
  'planet_medres_visual_monthly',
  'planet_medres_analytic_monthly',
  'mangrove_salt_marsh',
  'mangrove_tidal_flats',
  'mangrove_global_tidal_wetland_change',
  'mangrove_allen_coral_reef',
  'mangrove_coastal_protection_stock',
  'mangrove_coastal_protection_population',
  'mangrove_coastal_protection_area',
  'mangrove_fisheries',
  'mangrove_drivers_change',
  'mangrove_blue_carbon',
  'mangrove_height',
  'mangrove_biomass',
  'mangrove_protection',
  'mangrove_rest_sites',
  'mangrove_species_distribution',
  'mangrove_species_location',
  'mangrove_alerts',
  'mangrove_net_change',
  'mangrove_habitat_extent',
  'custom-area',
  'mangrove_restoration',
  'mangrove_iucn_ecoregion',
] satisfies (WidgetSlugType | ContextualBasemapsId | 'custom-area')[];

export const NATIONAL_DASHBOARD_LOCATIONS = [
  'AUS',
  'AIA',
  'ATG',
  'BHS',
  'BRB',
  'VGB',
  'CYM',
  'CUB',
  'DMA',
  'DOM',
  'GRD',
  'GLP',
  'HTI',
  'JAM',
  'MTQ',
  'PRI',
  'MAF',
  'KNA',
  'LCA',
  'VCT',
  'SXM',
  'TTO',
  'VIR',
  'KEN',
  'TZA',
  'MOZ',
  'MDG',
  'MEX',
];
