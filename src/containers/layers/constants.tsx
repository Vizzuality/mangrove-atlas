type ContextualLayersProps = {
  id: string;
  name: string;
  thumbSource?: string;
}[];

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
  {
    name: 'Commercial fisheries production',
    id: 'mangrove_commercial_fisheries_production',
  },
];

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

export const CONTEXTUAL_LAYERS_INFO: ContextualLayersProps = [
  {
    id: 'hi-res-extent',
    name: 'High Resolution Extent',
    thumbSource: '/images/thumbs/basemaps/hi-res-extent.jpg',
  },
  {
    id: 'mangrove_protected_areas',
    name: 'WDPA',
    thumbSource: '/images/thumbs/contextual/mangrove_protected_areas.png',
  },
  {
    id: 'planet_medres_visual_monthly',
    name: 'Planet-NICFI Satellite Imagery',
    thumbSource: '/images/thumbs/basemaps/basemap-satellite.jpg',
  },
];
