import BiomassLayer from 'containers/biomass/layer';
import BlueCarbonLayer from 'containers/blue-carbon/layer';
import CountryBoundariesLayer from 'containers/country/layer';
import HabitatExtentInfo from 'containers/habitat-extent/info.mdx';
import HabitatExtentLayer from 'containers/habitat-extent/layer';
import HeightLayer from 'containers/height/layer';
import ProtectedAreasLayer from 'containers/protected-areas/layer';

export const LAYERS = {
  'country-boundaries': CountryBoundariesLayer,
  'protected-areas': ProtectedAreasLayer,
  habitat_extent: HabitatExtentLayer,
  biomass: BiomassLayer,
  'blue-carbon': BlueCarbonLayer,
  height: HeightLayer,
};

export const INFO = {
  habitat_extent: HabitatExtentInfo,
};
