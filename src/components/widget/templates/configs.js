import MangroveCoverage from './mangrove-coverage/config';
import MangroveNetChange from './mangrove-net-change/config';
import MangroveActivity from './mangrove-activity/config';

export default {
  mangrove_coverage: MangroveCoverage,
  mangrove_net_change: MangroveNetChange,
  mangrove_activity: MangroveActivity,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
