import HighlightedPlaces from './highlighted-places/config';
import MangroveCoverage from './mangrove-coverage/config';
import MangroveNetChange from './mangrove-net-change/config';
import MangroveActivity from './mangrove-activity/config';
import MangroveAlerts from './mangrove-alerts/config';
import MangroveHeight from './mangrove-height/config';
import MangroveBiomass from './mangrove-biomass/config';

export default {
  mangrove_coverage: MangroveCoverage,
  mangrove_net_change: MangroveNetChange,
  mangrove_activity: MangroveActivity,
  highlighted_places: HighlightedPlaces,
  mangrove_alerts: MangroveAlerts,
  mangrove_height: MangroveHeight,
  mangrove_biomass: MangroveBiomass,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
