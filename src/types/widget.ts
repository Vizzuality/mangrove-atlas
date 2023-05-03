export type UseParamsOptions = Readonly<{
  location_id?: string;
  year?: number;
  unit?: string;
}>;

export type WidgetSlugType =
  | 'mangrove_habitat_extent'
  | 'mangrove_net_change'
  | 'mangrove_alerts'
  | 'mangrove_biomass'
  | 'mangrove_height'
  | 'mangrove_blue_carbon'
  | 'mangrove_protection'
  | 'mangrove_species_distribution'
  | 'mangrove_species_threatened';
