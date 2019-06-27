import MangroveCoverage from './mangrove-coverage/config';
import MangroveNetChange from './mangrove-net-change/config';
import MangroveActivity from './mangrove-activity/config';
import ConservationHotspots from './conservation-hotspots/config';

export default {
  'mangrove-coverage': MangroveCoverage,
  'mangrove-net-change': MangroveNetChange,
  'mangrove-activity': MangroveActivity,
  'conservation-hotspots': ConservationHotspots,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
