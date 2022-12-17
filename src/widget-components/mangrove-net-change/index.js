import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  ui: state.widgets.ui.net,
  locations: state.locations.list,
  drawingValue: state.drawingTool.drawingValue,
  drawingMode: state.drawingTool.drawingMode,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures
});

const mapDispatchToProps = {
  setUi,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
