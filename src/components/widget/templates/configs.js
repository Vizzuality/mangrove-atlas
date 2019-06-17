import MangroveCoverage from './mangrove-coverage/config';
import MangroveNetChange from './mangrove-net-change/config';

export default {
  mangrove_coverage: MangroveCoverage,
  mangrove_net_change: MangroveNetChange,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
