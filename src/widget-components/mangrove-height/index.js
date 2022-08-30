import { connect } from 'react-redux';

// modules
import { setUi } from 'modules/widgets/actions';
import { fetchMangroveHeightData } from 'modules/mangrove-height-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveHeightData.isLoading,
  data: state.mangroveHeightData.data,
  metadata: state.mangroveHeightData.metadata,
  ui: state.widgets.ui.height,
  drawingValue: state.drawingTool.drawingValue,
  drawingMode: state.drawingTool.drawingMode

});

const mapDispatchToProps = {
  setUi,
  fetchMangroveHeightData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);