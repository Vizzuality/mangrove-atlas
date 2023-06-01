export type UseParamsOptions = Readonly<{
  location_id?: string | number;
  year?: number;
  unit?: string;
}>;

export type WidgetTypes = {
  name: string;
  slug: WidgetSlugType;
  locationType: string[];
  categoryIds: string[];
  layersIds?: string[];
};

export type WidgetSlugType =
  | 'mangrove_habitat_extent'
  | 'mangrove_net_change'
  | 'mangrove_habitat_change'
  | 'mangrove_alerts'
  | 'mangrove_biomass'
  | 'mangrove_height'
  | 'mangrove_blue_carbon'
  | 'mangrove_protection'
  | 'mangrove_restoration'
  | 'mangrove_species_distribution'
  | 'mangrove_species_threatened'
  | 'mangrove_species_location'
  | 'mangrove_emissions_mitigation'
  | 'mangrove_international_status'
  | 'mangrove_carbon_market_potential'
  | 'mangrove_drawing_tool'
  | 'mangrove_drivers_change';
