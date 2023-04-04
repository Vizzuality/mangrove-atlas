import { connect } from 'react-redux';
import { openSearchPanel } from 'modules/locations/actions';
import Component from './component';

const mapStateToProps = (state) => ({
  drawingMode: state.drawingTool.drawingMode,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures,
  drawingValue: state.drawingTool.drawingValue,
  locationsModal: state.locations.isOpened
});

const mapDispatchToProps = {
  openSearchPanel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
