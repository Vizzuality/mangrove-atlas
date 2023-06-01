import AlertsDownload from 'containers/datasets/alerts/download';
import AlertsInfo from 'containers/datasets/alerts/info.mdx';
import AlertsLayer from 'containers/datasets/alerts/layer';
import AlertsWidget from 'containers/datasets/alerts/widget';
import BiomassDownload from 'containers/datasets/biomass/download';
import BiomassInfo from 'containers/datasets/biomass/info.mdx';
import BiomassLayer from 'containers/datasets/biomass/layer';
import BiomassWidget from 'containers/datasets/biomass/widget';
import BlueCarbonDownload from 'containers/datasets/blue-carbon/download';
import BlueCarbonInfo from 'containers/datasets/blue-carbon/info.mdx';
import BlueCarbonLayer from 'containers/datasets/blue-carbon/layer';
import BlueCarbonWidget from 'containers/datasets/blue-carbon/widget';
import CarbonMarketPotentialInfo from 'containers/datasets/carbon-market-potential/info.mdx';
import CarbonMarketPotentialWidget from 'containers/datasets/carbon-market-potential/widget';
import CountryBoundariesLayer from 'containers/datasets/country/layer';
import EmissionsMitigationInfo from 'containers/datasets/emissions-mitigation/info.mdx';
import EmissionsMitigationWidget from 'containers/datasets/emissions-mitigation/widget';
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
import NetChangeInfo from 'containers/datasets/net-change/info.mdx';
import NetChangeLayer from 'containers/datasets/net-change/layer';
import NetChangeWidget from 'containers/datasets/net-change/widget';
import ProtectedAreasLayer from 'containers/datasets/protected-areas/layer';
import ProtectionInfo from 'containers/datasets/protection/info.mdx';
import ProtectionLayer from 'containers/datasets/protection/layer';
import ProtectionWidget from 'containers/datasets/protection/widget';
import RestorationInfo from 'containers/datasets/restoration/info.mdx';
import RestorationLayer from 'containers/datasets/restoration/layer';
import SpeciesDistributionInfo from 'containers/datasets/species-distribution/info.mdx';
import SpeciesDistributionLayer from 'containers/datasets/species-distribution/layer';
import SpeciesDistributionWidget from 'containers/datasets/species-distribution/widget';
import SpeciesLocationLayer from 'containers/datasets/species-location/layer';
import SpeciesLocationWidget from 'containers/datasets/species-location/widget';
import SpeciesThreatenedInfo from 'containers/datasets/species-threatened/info.mdx';
import SpeciesThreatenedWidget from 'containers/datasets/species-threatened/widget';

export const WIDGETS = {
  mangrove_habitat_extent: HabitatExtentWidget,
  mangrove_habitat_change: HabitatChangeWidget,
  mangrove_net_change: NetChangeWidget,
  mangrove_alerts: AlertsWidget,
  mangrove_biomass: BiomassWidget,
  mangrove_height: HeightWidget,
  mangrove_blue_carbon: BlueCarbonWidget,
  mangrove_protection: ProtectionWidget,
  mangrove_species_distribution: SpeciesDistributionWidget,
  mangrove_species_threatened: SpeciesThreatenedWidget,
  mangrove_species_location: SpeciesLocationWidget,
  mangrove_international_status: InternationalStatusWidget,
  mangrove_carbon_market_potential: CarbonMarketPotentialWidget,
  mangrove_emissions_mitigation: EmissionsMitigationWidget,
};

export const LAYERS = {
  'country-boundaries': CountryBoundariesLayer,
  'protected-areas': ProtectedAreasLayer,
  mangrove_habitat_extent: HabitatExtentLayer,
  mangrove_net_change: NetChangeLayer,
  mangrove_alerts: AlertsLayer,
  mangrove_biomass: BiomassLayer,
  mangrove_blue_carbon: BlueCarbonLayer,
  mangrove_height: HeightLayer,
  mangrove_restoration: RestorationLayer,
  mangrove_species_distribution: SpeciesDistributionLayer,
  mangrove_protection: ProtectionLayer,
  mangrove_species_location: SpeciesLocationLayer,
};

export const INFO = {
  mangrove_habitat_extent: HabitatExtentInfo,
  mangrove_habitat_change: HabitatChangeInfo,
  mangrove_species_distribution: SpeciesDistributionInfo,
  mangrove_species_threatened: SpeciesThreatenedInfo,
  mangrove_protection: ProtectionInfo,
  mangrove_net_change: NetChangeInfo,
  mangrove_alerts: AlertsInfo,
  mangrove_restoration: RestorationInfo,
  mangrove_biomass: BiomassInfo,
  mangrove_height: HeightInfo,
  mangrove_blue_carbon: BlueCarbonInfo,
  mangrove_emissions_mitigation: EmissionsMitigationInfo,
  mangrove_carbon_market_potential: CarbonMarketPotentialInfo,
  mangrove_international_status: InternationalStatusInfo,
};

export const DOWNLOAD = {
  mangrove_habitat_extent: HabitatExtentDownload,
  // mangrove_net_change: NetChangeDownload,
  mangrove_alerts: AlertsDownload,
  mangrove_biomass: BiomassDownload,
  // mangrove_height: HeightDownload,
  mangrove_blue_carbon: BlueCarbonDownload,
};
