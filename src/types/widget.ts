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
  contextualLayersIds?: string[];
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
  | 'mangrove_restoration_sites'
  | 'mangrove_species_distribution'
  | 'mangrove_species_threatened'
  | 'mangrove_species_location'
  | 'mangrove_emissions_mitigation'
  | 'mangrove_international_status'
  | 'mangrove_carbon_market_potential'
  | 'mangrove_drivers_change'
  | 'mangrove_national_dashboard'
  | 'mangrove_layer_name_second'
  | 'mangrove_contextual_basemaps'
  | 'mangrove_drawing_tool';

export type AnalysisWidgetSlug =
  | 'mangrove_extent'
  | 'mangrove_net_change'
  | 'mangrove_height'
  | 'mangrove_biomass'
  | 'mangrove_blue_carbon';

export type ContextualBasemapsId =
  | 'planet_medres_visual_monthly'
  | 'planet_medres_analytic_monthly';
export type MosaicId =
  | '45d01564-c099-42d8-b8f2-a0851accf3e7'
  | 'be1f8e5e-6a29-4d27-8542-1fdb664fd78e';
