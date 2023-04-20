import BiomassLayer from 'containers/datasets/biomass/layer';
import BlueCarbonLayer from 'containers/datasets/blue-carbon/layer';
import CountryBoundariesLayer from 'containers/datasets/country/layer';
import HabitatExtentInfo from 'containers/datasets/habitat-extent/info.mdx';
import HabitatExtentLayer from 'containers/datasets/habitat-extent/layer';
import HeightLayer from 'containers/datasets/height/layer';
import ProtectedAreasLayer from 'containers/datasets/protected-areas/layer';

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
