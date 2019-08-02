import MangroveCoverage from './mangrove-coverage/config';
import MangroveNetChange from './mangrove-net-change/config';
import MangroveActivity from './mangrove-activity/config';
import ConservationHotspots from './conservation-hotspots/config';

export default {
  mangrove_coverage: MangroveCoverage,
  mangrove_net_change: MangroveNetChange,
  mangrove_activity: MangroveActivity,
  highlighted_places: ConservationHotspots,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
