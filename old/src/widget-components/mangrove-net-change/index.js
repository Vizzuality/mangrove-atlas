import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import { fetchMangroveNetChangeData } from 'modules/mangrove-net-change-data/actions';
import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveNetChangeData.isLoading,
  data: state.mangroveNetChangeData.data,
  metadata: state.mangroveNetChangeData.metadata,
  ui: state.widgets.ui.net,
  locations: state.locations.list,
  drawingValue: state.drawingTool.drawingValue,
  drawingMode: state.drawingTool.drawingMode,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveNetChangeData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
