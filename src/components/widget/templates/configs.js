import HighlightedPlaces from './highlighted-places/config';
import MangroveCoverage from './mangrove-coverage/config';
import MangroveNetChange from './mangrove-net-change/config';
import MangroveActivity from './mangrove-activity/config';
import MangroveAlerts from './mangrove-alerts/config';

export default {
  mangrove_coverage: MangroveCoverage,
  mangrove_net_change: MangroveNetChange,
  mangrove_activity: MangroveActivity,
  highlighted_places: HighlightedPlaces,
  mangrove_alerts: MangroveAlerts,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
