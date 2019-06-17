import MangroveCoverage from './mangrove-coverage/config';

export default {
  mangrove_coverage: MangroveCoverage,
  default: {
    parse: () => ({
      template: 'Template not defined',
      chart: []
    })
  }
};
