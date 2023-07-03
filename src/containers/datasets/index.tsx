import AlertsDownload from 'containers/datasets/alerts/download';
import AlertsInfo from 'containers/datasets/alerts/info.mdx';
import AlertsLayer from 'containers/datasets/alerts/layer';
import AlertsWidget from 'containers/datasets/alerts/widget';
import BiomassDownload from 'containers/datasets/biomass/download';
import BiomassInfo from 'containers/datasets/biomass/info.mdx';
import BiomassLayer from 'containers/datasets/biomass/layer';
import BiomassWidget from 'containers/datasets/biomass/widget';
// import BiomassDownload from 'containers/datasets/biomass/download';
import BlueCarbonDownload from 'containers/datasets/blue-carbon/download';
import BlueCarbonInfo from 'containers/datasets/blue-carbon/info.mdx';
import BlueCarbonLayer from 'containers/datasets/blue-carbon/layer';
import BlueCarbonWidget from 'containers/datasets/blue-carbon/widget';
import CarbonMarketPotentialInfo from 'containers/datasets/carbon-market-potential/info.mdx';
import CarbonMarketPotentialWidget from 'containers/datasets/carbon-market-potential/widget';

// contextual layers
import AllenCoralReefWidget from 'containers/datasets/contextual-layers/allen-coral-reef';
import AllenCoralReefLayer from 'containers/datasets/contextual-layers/allen-coral-reef/layer';
import PlanetSatelliteBasemapAnalyticLayer from 'containers/datasets/contextual-layers/basemaps-planet/analytic/layer';
import PlanetSatelliteBasemapVisualLayer from 'containers/datasets/contextual-layers/basemaps-planet/visual/layer';
import CountryBoundariesLayer from 'containers/datasets/contextual-layers/country/layer';
import LayerNameContentSecond from 'containers/datasets/contextual-layers/layer-name-second';
import LayerNameInfoSecond from 'containers/datasets/contextual-layers/layer-name-second/info.mdx';
import LayerNameLayerSecond from 'containers/datasets/contextual-layers/layer-name-second/layer';
import ProtectedAreasLayer from 'containers/datasets/contextual-layers/protected-areas/layer';
import DrawingToolWidget from 'containers/datasets/drawing-tool/widget';
import DriversChangeInfo from 'containers/datasets/drivers-change/info.mdx';
import DriversChangeLayer from 'containers/datasets/drivers-change/layer';
import DriversChangeWidget from 'containers/datasets/drivers-change/widget';
import EmissionsMitigationInfo from 'containers/datasets/emissions-mitigation/info.mdx';
import EmissionsMitigationWidget from 'containers/datasets/emissions-mitigation/widget';
import FisheriesLayer from 'containers/datasets/fisheries/layer';
import FisheriesWidget from 'containers/datasets/fisheries/widget';
import FloodProtectionInfo from 'containers/datasets/flood-protection/info.mdx';
import FloodProtectionAreaLayer from 'containers/datasets/flood-protection/storms/layers/area';
import FloodProtectionPopulationLayer from 'containers/datasets/flood-protection/storms/layers/population';
import FloodProtectionStockLayer from 'containers/datasets/flood-protection/storms/layers/stock';
import FloodProtectionWidget from 'containers/datasets/flood-protection/widget';
import HabitatChangeInfo from 'containers/datasets/habitat-change/info.mdx';
import HabitatChangeWidget from 'containers/datasets/habitat-change/widget';
import HabitatExtentDownload from 'containers/datasets/habitat-extent/download';
import HabitatExtentInfo from 'containers/datasets/habitat-extent/info.mdx';
import HabitatExtentLayer from 'containers/datasets/habitat-extent/layer';
import HabitatExtentWidget from 'containers/datasets/habitat-extent/widget';
import HeightInfo from 'containers/datasets/height/info.mdx';
import HeightLayer from 'containers/datasets/height/layer';
import HeightWidget from 'containers/datasets/height/widget';
// import HeightDownload from 'containers/datasets/height/download';
// import NetChangeDownload from 'containers/datasets/net-change/download';
import InternationalStatusInfo from 'containers/datasets/international-status/info.mdx';
import InternationalStatusWidget from 'containers/datasets/international-status/widget';
import NationalDashboardInfo from 'containers/datasets/national-dashboard/info.mdx';
import NationalDashboardLayer from 'containers/datasets/national-dashboard/layer';
import NationalDashboardWidget from 'containers/datasets/national-dashboard/widget';
import NetChangeInfo from 'containers/datasets/net-change/info.mdx';
import NetChangeLayer from 'containers/datasets/net-change/layer';
import NetChangeWidget from 'containers/datasets/net-change/widget';
import ProtectionInfo from 'containers/datasets/protection/info.mdx';
import ProtectionLayer from 'containers/datasets/protection/layer';
import ProtectionWidget from 'containers/datasets/protection/widget';
import RestorationInfo from 'containers/datasets/restoration/info.mdx';
import RestorationLayer from 'containers/datasets/restoration/layer';
import RestorationWidget from 'containers/datasets/restoration/widget';
import RestorationSitesInfo from 'containers/datasets/restoration-sites/info.mdx';
import RestorationSitesLayer from 'containers/datasets/restoration-sites/layer';
import RestorationSitesWidget from 'containers/datasets/restoration-sites/widget';
import SpeciesDistributionInfo from 'containers/datasets/species-distribution/info.mdx';
import SpeciesDistributionLayer from 'containers/datasets/species-distribution/layer';
import SpeciesDistributionWidget from 'containers/datasets/species-distribution/widget';
import SpeciesLocationLayer from 'containers/datasets/species-location/layer';
import SpeciesLocationWidget from 'containers/datasets/species-location/widget';
import SpeciesThreatenedInfo from 'containers/datasets/species-threatened/info.mdx';
import SpeciesThreatenedWidget from 'containers/datasets/species-threatened/widget';

import BasemapsContextualMapSettings from 'components/contextual-basemaps';
import { WidgetSlugType } from 'types/widget';

export const WIDGETS = {
  mangrove_habitat_extent: HabitatExtentWidget,
  mangrove_habitat_change: HabitatChangeWidget,
  mangrove_net_change: NetChangeWidget,
  mangrove_alerts: AlertsWidget,
  mangrove_biomass: BiomassWidget,
  mangrove_drivers_change: DriversChangeWidget,
  mangrove_height: HeightWidget,
  mangrove_blue_carbon: BlueCarbonWidget,
  mangrove_protection: ProtectionWidget,
  mangrove_species_distribution: SpeciesDistributionWidget,
  mangrove_species_threatened: SpeciesThreatenedWidget,
  mangrove_species_location: SpeciesLocationWidget,
  mangrove_international_status: InternationalStatusWidget,
  mangrove_carbon_market_potential: CarbonMarketPotentialWidget,
  mangrove_emissions_mitigation: EmissionsMitigationWidget,
  mangrove_restoration_sites: RestorationSitesWidget,
  mangrove_restoration: RestorationWidget,
  mangrove_drawing_tool: DrawingToolWidget,
  mangrove_national_dashboard: NationalDashboardWidget,
  mangrove_flood_protection: FloodProtectionWidget,
  mangrove_layer_name_second: LayerNameContentSecond,
  mangrove_contextual_basemaps: BasemapsContextualMapSettings,
  mangrove_fisheries: FisheriesWidget,
  mangrove_allen_coral_reef: AllenCoralReefWidget,
} satisfies Partial<Record<WidgetSlugType, () => JSX.Element>>;

export const LAYERS = {
  mangrove_habitat_extent: HabitatExtentLayer,
  mangrove_net_change: NetChangeLayer,
  mangrove_alerts: AlertsLayer,
  mangrove_biomass: BiomassLayer,
  mangrove_blue_carbon: BlueCarbonLayer,
  mangrove_drivers_change: DriversChangeLayer,
  mangrove_height: HeightLayer,
  mangrove_restoration: RestorationLayer,
  mangrove_species_distribution: SpeciesDistributionLayer,
  mangrove_protection: ProtectionLayer,
  mangrove_species_location: SpeciesLocationLayer,
  // contextual layers
  'country-boundaries': CountryBoundariesLayer,
  'protected-areas': ProtectedAreasLayer,
  mangrove_layer_name_second: LayerNameLayerSecond,
  mangrove_restoration_sites: RestorationSitesLayer,
  mangrove_coastal_protection_area: FloodProtectionAreaLayer,
  mangrove_coastal_protection_population: FloodProtectionPopulationLayer,
  mangrove_coastal_protection_stock: FloodProtectionStockLayer,
  mangrove_national_dashboard_layer: NationalDashboardLayer,
  mangrove_fisheries: FisheriesLayer,
  mangrove_allen_coral_reef: AllenCoralReefLayer,
};

export const INFO = {
  mangrove_habitat_extent: HabitatExtentInfo,
  mangrove_habitat_change: HabitatChangeInfo,
  mangrove_species_distribution: SpeciesDistributionInfo,
  mangrove_species_threatened: SpeciesThreatenedInfo,
  mangrove_protection: ProtectionInfo,
  mangrove_drivers_change: DriversChangeInfo,
  mangrove_net_change: NetChangeInfo,
  mangrove_alerts: AlertsInfo,
  mangrove_restoration: RestorationInfo,
  mangrove_biomass: BiomassInfo,
  mangrove_height: HeightInfo,
  mangrove_blue_carbon: BlueCarbonInfo,
  mangrove_emissions_mitigation: EmissionsMitigationInfo,
  mangrove_carbon_market_potential: CarbonMarketPotentialInfo,
  mangrove_international_status: InternationalStatusInfo,
  mangrove_layer_name_second: LayerNameInfoSecond,
  mangrove_restoration_sites: RestorationSitesInfo,
  mangrove_national_dashboard: NationalDashboardInfo,
  mangrove_flood_protection: FloodProtectionInfo,
};

export const DOWNLOAD = {
  mangrove_habitat_extent: HabitatExtentDownload,
  // mangrove_net_change: NetChangeDownload,
  mangrove_alerts: AlertsDownload,
  mangrove_biomass: BiomassDownload,
  // mangrove_height: HeightDownload,
  mangrove_blue_carbon: BlueCarbonDownload,
};

export const BASEMAPS = {
  planet_medres_visual_monthly: PlanetSatelliteBasemapVisualLayer,
  planet_medres_analytic_monthly: PlanetSatelliteBasemapAnalyticLayer,
};
