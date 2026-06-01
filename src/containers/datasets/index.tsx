import AlertsWidget from '@/containers/datasets/alerts/widget';
import AlertsWidgetStaging from '@/containers/datasets/alerts-staging/widget';
import BiomassWidget from '@/containers/datasets/biomass/widget';
import BlueCarbonWidget from '@/containers/datasets/blue-carbon/widget';
import CarbonMarketPotentialWidget from '@/containers/datasets/carbon-market-potential/widget';
import AllenCoralReefWidget from '@/containers/datasets/contextual-layers/allen-coral-reef';
import GlobalTidalWetlandChangeWidget from '@/containers/datasets/contextual-layers/global-tidal-wetland-change';
import ProtectedAreasWidget from '@/containers/datasets/contextual-layers/protected-areas';
import SaltMarshWidget from '@/containers/datasets/contextual-layers/salt-marsh';
import TidalFlatsWidget from '@/containers/datasets/contextual-layers/tidal-flats';
import CustomizeWidgetsDeck from '@/containers/datasets/customize-widgets-deck/widget';
import DriversChangeWidget from '@/containers/datasets/drivers-change/widget';
import EmissionsMitigationWidget from '@/containers/datasets/emissions-mitigation/widget';
import FisheriesWidget from '@/containers/datasets/fisheries';
import FloodProtectionWidget from '@/containers/datasets/flood-protection';
import HabitatChangeWidget from '@/containers/datasets/habitat-change/widget';
import HabitatExtentWidget from '@/containers/datasets/habitat-extent/widget';
import HeightWidget from '@/containers/datasets/height/widget';
import InternationalStatusWidget from '@/containers/datasets/international-status';
import IUCNEcoregionWidget from '@/containers/datasets/iucn-ecoregion/widget';
import ProtectionWidget from '@/containers/datasets/mangroves-in-protected-areas/widget';
import NationalDashboardWidget from '@/containers/datasets/national-dashboard/widget';
import NetChangeWidget from '@/containers/datasets/net-change/widget';
import RestorationWidget from '@/containers/datasets/restoration/widget';
import RestorationSitesWidget from '@/containers/datasets/restoration-sites/widget';
import SpeciesDistributionWidget from '@/containers/datasets/species-distribution/widget';
import SpeciesLocationWidget from '@/containers/datasets/species-location/widget';
import SpeciesThreatenedWidget from '@/containers/datasets/species-threatened/widget';

import BasemapsContextualLayers from '@/components/contextual/contextual-layers';
import { WidgetSlugType } from 'types/widget';

type WidgetsCollection = Partial<Record<WidgetSlugType, () => JSX.Element>>;

export const WIDGETS: WidgetsCollection = {
  mangrove_habitat_extent: HabitatExtentWidget,
  mangrove_habitat_change: HabitatChangeWidget,
  mangrove_net_change: NetChangeWidget,
  mangrove_alerts:
    JSON.parse(process.env.NEXT_PUBLIC_FEATURED_FLAGS || '{}')['mangrove_alerts'] === true
      ? AlertsWidget
      : AlertsWidgetStaging,
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
  mangrove_rest_sites: RestorationSitesWidget,
  mangrove_restoration: RestorationWidget,
  mangrove_national_dashboard: NationalDashboardWidget,
  mangrove_flood_protection: FloodProtectionWidget,
  mangrove_contextual_layers: BasemapsContextualLayers,
  mangrove_protected_areas: ProtectedAreasWidget,
  mangrove_fisheries: FisheriesWidget,
  mangrove_allen_coral_reef: AllenCoralReefWidget,
  mangrove_tidal_flats: TidalFlatsWidget,
  mangrove_global_tidal_wetland_change: GlobalTidalWetlandChangeWidget,
  mangrove_iucn_ecoregion: IUCNEcoregionWidget,
  mangrove_salt_marsh: SaltMarshWidget,
  mangrove_coastal_protection_area: FloodProtectionWidget,
  mangrove_coastal_protection_population: FloodProtectionWidget,
  mangrove_coastal_protection_stock: FloodProtectionWidget,
  widgets_deck_tool: CustomizeWidgetsDeck,
} satisfies Partial<Record<WidgetSlugType, () => JSX.Element>>;

export { LAYERS, MAP_LEGENDS, INFO, DOWNLOAD, BASEMAPS } from './registries';
