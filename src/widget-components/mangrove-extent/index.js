import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import { fetchMangroveHabitatExtentData } from 'modules/mangrove-habitat-extent-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveHabitatExtentData.isLoading,
  data: state.mangroveHabitatExtentData.data,
  analysis: state.mangroveHabitatExtentData.dataAnalysis,
  metadata: state.mangroveHabitatExtentData?.metadata,
  error: state.mangroveHabitatExtentData.error,
  ui: state.widgets.ui.extent,
  drawingValue: state.drawingTool.drawingValue,
  drawingMode: state.drawingTool.drawingMode
});
const mapDispatchToProps = {
  setUi,
  fetchMangroveHabitatExtentData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
