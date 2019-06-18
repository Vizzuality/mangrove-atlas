import MangroveCoverage from './mangrove-coverage/config';
import MangroveNetChange from './mangrove-net-change/config';
import MangroveActivity from './mangrove-activity/config';

export default {
  'mangrove-coverage': MangroveCoverage,
  'mangrove-net-change': MangroveNetChange,
  'mangrove-activity': MangroveActivity,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
