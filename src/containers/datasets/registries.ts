import AlertsDownload from '@/containers/datasets/alerts/download';
import AlertsInfo from '@/containers/datasets/alerts/info.mdx';
import AlertsLayer from '@/containers/datasets/alerts/layer';
import AlertsMapLegend from '@/containers/datasets/alerts/map-legend';
import AlertsDownloadStaging from '@/containers/datasets/alerts-staging/download';
import AlertsInfoStaging from '@/containers/datasets/alerts-staging/info.mdx';
import AlertsLayerStaging from '@/containers/datasets/alerts-staging/layer';
import AlertsMapLegendStaging from '@/containers/datasets/alerts-staging/map-legend';
import BiomassDownload from '@/containers/datasets/biomass/download';
import BiomassInfo from '@/containers/datasets/biomass/info.mdx';
import BiomassLayer from '@/containers/datasets/biomass/layer';
import BiomassMapLegend from '@/containers/datasets/biomass/map-legend';
import BlueCarbonDownload from '@/containers/datasets/blue-carbon/download';
import BlueCarbonInfo from '@/containers/datasets/blue-carbon/info.mdx';
import BlueCarbonLayer from '@/containers/datasets/blue-carbon/layer';
import BlueCarbonMapLegend from '@/containers/datasets/blue-carbon/map-legend';
import CarbonMarketPotentialInfo from '@/containers/datasets/carbon-market-potential/info.mdx';
import AllenCoralReefInfo from '@/containers/datasets/contextual-layers/allen-coral-reef/info.mdx';
import AllenCoralReefLayer from '@/containers/datasets/contextual-layers/allen-coral-reef/layer';
import AllenCoralReefMapLegend from '@/containers/datasets/contextual-layers/allen-coral-reef/map-legend';
import PlanetSatelliteBasemapAnalyticLayer from '@/containers/datasets/contextual-layers/basemaps-planet/analytic/layer';
import PlanetSatelliteBasemapVisualLayer from '@/containers/datasets/contextual-layers/basemaps-planet/visual/layer';
import CountryBoundariesLayer from '@/containers/datasets/contextual-layers/country/layer';
import GlobalTidalWetlandChangeInfo from '@/containers/datasets/contextual-layers/global-tidal-wetland-change/info.mdx';
import GlobalTidalWetlandChangeLayer from '@/containers/datasets/contextual-layers/global-tidal-wetland-change/layer';
import GlobalTidalWetlandChangeMapLegend from '@/containers/datasets/contextual-layers/global-tidal-wetland-change/map-legend';
import HiResExtentInfo from '@/containers/datasets/contextual-layers/hi-res-extent/info.mdx';
import HiResExtentLayer from '@/containers/datasets/contextual-layers/hi-res-extent/layer';
import PlanetSatelliteBasemapInfo from '@/containers/datasets/contextual-layers/planet/info.mdx';
import ProtectedAreasLayer from '@/containers/datasets/contextual-layers/protected-areas/layer';
import ProtectedAreasMapLegend from '@/containers/datasets/contextual-layers/protected-areas/map-legend';
import SaltMarshInfo from '@/containers/datasets/contextual-layers/salt-marsh/info.mdx';
import SaltMarshLayer from '@/containers/datasets/contextual-layers/salt-marsh/layer';
import SaltMarshMapLegend from '@/containers/datasets/contextual-layers/salt-marsh/map-legend';
import TidalFlatsInfo from '@/containers/datasets/contextual-layers/tidal-flats/info.mdx';
import TidalFlatsLayer from '@/containers/datasets/contextual-layers/tidal-flats/layer';
import TidalFlatsMapLegend from '@/containers/datasets/contextual-layers/tidal-flats/map-legend';
import DriversChangeInfo from '@/containers/datasets/drivers-change/info.mdx';
import DriversChangeLayer from '@/containers/datasets/drivers-change/layer';
import DriversChangeMapLegend from '@/containers/datasets/drivers-change/map-legend';
import EmissionsMitigationInfo from '@/containers/datasets/emissions-mitigation/info.mdx';
import CommercialFisheriesProductionDownload from '@/containers/datasets/fisheries/commercial-fisheries-production/download';
import CommercialFisheriesProductionInfo from '@/containers/datasets/fisheries/commercial-fisheries-production/info.mdx';
import MangrovesCommercialFisheriesProductionLayer from '@/containers/datasets/fisheries/commercial-fisheries-production/layer';
import CommercialFisheriesProductionMapLegend from '@/containers/datasets/fisheries/commercial-fisheries-production/map-legend';
import FisheriesInfo from '@/containers/datasets/fisheries/fisheries/info.mdx';
import FisheriesLayer from '@/containers/datasets/fisheries/fisheries/layer';
import FisheriesMapLegend from '@/containers/datasets/fisheries/fisheries/map-legend';
import FloodProtectionInfo from '@/containers/datasets/flood-protection/info.mdx';
import FloodProtectionAreaMapLegend from '@/containers/datasets/flood-protection/map-legend/area';
import FloodProtectionPopulationMapLegend from '@/containers/datasets/flood-protection/map-legend/population';
import FloodProtectionStockMapLegend from '@/containers/datasets/flood-protection/map-legend/stock';
import FloodProtectionAreaLayer from '@/containers/datasets/flood-protection/storms/layers/area';
import FloodProtectionPopulationLayer from '@/containers/datasets/flood-protection/storms/layers/population';
import FloodProtectionStockLayer from '@/containers/datasets/flood-protection/storms/layers/stock';
import HabitatChangeInfo from '@/containers/datasets/habitat-change/info.mdx';
import HabitatExtentDownload from '@/containers/datasets/habitat-extent/download';
import HabitatExtentInfo from '@/containers/datasets/habitat-extent/info.mdx';
import HabitatExtentLayer from '@/containers/datasets/habitat-extent/layer';
import HabitatExtentMapLegend from '@/containers/datasets/habitat-extent/map-legend';
import HeightInfo from '@/containers/datasets/height/info.mdx';
import HeightLayer from '@/containers/datasets/height/layer';
import HeightMapLegend from '@/containers/datasets/height/map-legend';
import InternationalStatusInfo from '@/containers/datasets/international-status/info.mdx';
import IUCNEcoregionInfo from '@/containers/datasets/iucn-ecoregion/info.mdx';
import IUCNEcoregionLayer from '@/containers/datasets/iucn-ecoregion/layer';
import IUCNEcoregionsMapLegend from '@/containers/datasets/iucn-ecoregion/map-legend';
import ProtectionInfo from '@/containers/datasets/mangroves-in-protected-areas/info.mdx';
import ProtectionLayer from '@/containers/datasets/mangroves-in-protected-areas/layer';
import ProtectionMapLegend from '@/containers/datasets/mangroves-in-protected-areas/map-legend';
import NationalDashboardInfo from '@/containers/datasets/national-dashboard/info.mdx';
import NationalDashboardLayer from '@/containers/datasets/national-dashboard/layer';
import NationalDashboardMapLegend from '@/containers/datasets/national-dashboard/map-legend';
import NetChangeInfo from '@/containers/datasets/net-change/info.mdx';
import NetChangeLayer from '@/containers/datasets/net-change/layer';
import NetChangeMapLegend from '@/containers/datasets/net-change/map-legend';
import RestorationInfo from '@/containers/datasets/restoration/info.mdx';
import RestorationLayer from '@/containers/datasets/restoration/layer';
import RestorationMapLegend from '@/containers/datasets/restoration/map-legend';
import RestorationSitesInfo from '@/containers/datasets/restoration-sites/info.mdx';
import RestorationSitesLayer from '@/containers/datasets/restoration-sites/layer';
import RestorationSitesMapLegend from '@/containers/datasets/restoration-sites/map-legend';
import SpeciesDistributionInfo from '@/containers/datasets/species-distribution/info.mdx';
import SpeciesDistributionLayer from '@/containers/datasets/species-distribution/layer';
import SpeciesDistributionMapLegend from '@/containers/datasets/species-distribution/map-legend';
import SpeciesLocationInfo from '@/containers/datasets/species-location/info.mdx';
import SpeciesLocationLayer from '@/containers/datasets/species-location/layer';
import SpeciesLocationtMapLegend from '@/containers/datasets/species-location/map-legend';
import SpeciesThreatenedInfo from '@/containers/datasets/species-threatened/info.mdx';

const featuredFlags = JSON.parse(process.env.NEXT_PUBLIC_FEATURED_FLAGS || '{}') as Record<
  string,
  boolean
>;

export const LAYERS = {
  mangrove_habitat_extent: HabitatExtentLayer,
  'hi-res-extent': HiResExtentLayer,
  mangrove_net_change: NetChangeLayer,
  mangrove_alerts: featuredFlags['mangrove_alerts'] === true ? AlertsLayer : AlertsLayerStaging,
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
  mangrove_protected_areas: ProtectedAreasLayer,
  mangrove_rest_sites: RestorationSitesLayer,
  mangrove_coastal_protection_area: FloodProtectionAreaLayer,
  mangrove_coastal_protection_population: FloodProtectionPopulationLayer,
  mangrove_coastal_protection_stock: FloodProtectionStockLayer,
  mangrove_iucn_ecoregion: IUCNEcoregionLayer,
  mangrove_national_dashboard_layer: NationalDashboardLayer,
  mangrove_fisheries: FisheriesLayer,
  mangrove_allen_coral_reef: AllenCoralReefLayer,
  mangrove_tidal_flats: TidalFlatsLayer,
  mangrove_global_tidal_wetland_change: GlobalTidalWetlandChangeLayer,
  mangrove_salt_marsh: SaltMarshLayer,
  planet_medres_visual_monthly: PlanetSatelliteBasemapVisualLayer,
  planet_medres_analytic_monthly: PlanetSatelliteBasemapAnalyticLayer,
  mangrove_commercial_fisheries_production: MangrovesCommercialFisheriesProductionLayer,
};

export const MAP_LEGENDS = {
  mangrove_habitat_extent: HabitatExtentMapLegend,
  mangrove_net_change: NetChangeMapLegend,
  mangrove_species_location: SpeciesLocationtMapLegend,
  mangrove_species_distribution: SpeciesDistributionMapLegend,
  mangrove_protection: ProtectionMapLegend,
  mangrove_restoration: RestorationMapLegend,
  mangrove_biomass: BiomassMapLegend,
  mangrove_height: HeightMapLegend,
  mangrove_blue_carbon: BlueCarbonMapLegend,
  mangrove_drivers_change: DriversChangeMapLegend,
  mangrove_fisheries: FisheriesMapLegend,
  mangrove_alerts:
    featuredFlags['mangrove_alerts'] === true ? AlertsMapLegend : AlertsMapLegendStaging,
  mangrove_allen_coral_reef: AllenCoralReefMapLegend,
  mangrove_salt_marsh: SaltMarshMapLegend,
  mangrove_tidal_flats: TidalFlatsMapLegend,
  mangrove_global_tidal_wetland_change: GlobalTidalWetlandChangeMapLegend,
  mangrove_protected_areas: ProtectedAreasMapLegend,
  mangrove_coastal_protection_area: FloodProtectionAreaMapLegend,
  mangrove_coastal_protection_population: FloodProtectionPopulationMapLegend,
  mangrove_coastal_protection_stock: FloodProtectionStockMapLegend,
  mangrove_rest_sites: RestorationSitesMapLegend,
  mangrove_iucn_ecoregion: IUCNEcoregionsMapLegend,
  mangrove_national_dashboard_layer: NationalDashboardMapLegend,
  mangrove_commercial_fisheries_production: CommercialFisheriesProductionMapLegend,
};

export const INFO = {
  mangrove_habitat_extent: HabitatExtentInfo,
  'hi-res-extent': HiResExtentInfo,
  mangrove_habitat_change: HabitatChangeInfo,
  mangrove_species_distribution: SpeciesDistributionInfo,
  mangrove_species_threatened: SpeciesThreatenedInfo,
  mangrove_protected_areas: ProtectionInfo,
  mangrove_drivers_change: DriversChangeInfo,
  mangrove_net_change: NetChangeInfo,
  mangrove_alerts: featuredFlags['mangrove_alerts'] === true ? AlertsInfo : AlertsInfoStaging,
  mangrove_restoration: RestorationInfo,
  mangrove_biomass: BiomassInfo,
  mangrove_height: HeightInfo,
  mangrove_blue_carbon: BlueCarbonInfo,
  mangrove_emissions_mitigation: EmissionsMitigationInfo,
  mangrove_carbon_market_potential: CarbonMarketPotentialInfo,
  mangrove_international_status: InternationalStatusInfo,
  mangrove_rest_sites: RestorationSitesInfo,
  mangrove_national_dashboard: NationalDashboardInfo,
  mangrove_flood_protection: FloodProtectionInfo,
  mangrove_iucn_ecoregion: IUCNEcoregionInfo,
  mangrove_fisheries: FisheriesInfo,
  mangrove_allen_coral_reef: AllenCoralReefInfo,
  mangrove_tidal_flats: TidalFlatsInfo,
  mangrove_global_tidal_wetland_change: GlobalTidalWetlandChangeInfo,
  mangrove_species_location: SpeciesLocationInfo,
  mangrove_salt_marsh: SaltMarshInfo,
  mangrove_contextual_layers: PlanetSatelliteBasemapInfo,
  planet_medres_visual_monthly: PlanetSatelliteBasemapInfo,
  planet_medres_analytic_monthly: PlanetSatelliteBasemapInfo,
  mangrove_commercial_fisheries_production: CommercialFisheriesProductionInfo,
};

export const DOWNLOAD = {
  mangrove_habitat_extent: HabitatExtentDownload,
  // mangrove_net_change: NetChangeDownload,
  mangrove_alerts:
    featuredFlags['mangrove_alerts'] === true ? AlertsDownload : AlertsDownloadStaging,
  mangrove_biomass: BiomassDownload,
  // mangrove_height: HeightDownload,
  mangrove_blue_carbon: BlueCarbonDownload,
  mangrove_commercial_fisheries_production: CommercialFisheriesProductionDownload,
};

export const BASEMAPS = {
  planet_medres_visual_monthly: PlanetSatelliteBasemapVisualLayer,
  planet_medres_analytic_monthly: PlanetSatelliteBasemapAnalyticLayer,
};
