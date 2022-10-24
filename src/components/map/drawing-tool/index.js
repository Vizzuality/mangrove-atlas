import { connect } from 'react-redux';

import { setCurrent, setDrawingValue, setDrawingStatus, setCustomGeojsonFeatures } from 'modules/drawing-tool/actions';
import { setMobileView } from 'modules/app/actions';

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.drawingTool.current,
  drawingValue: state.drawingTool.drawingValue,
});

const mapDispatchToProps = {
  setCurrent,
  setDrawingValue,
  setDrawingStatus,
  setCustomGeojsonFeatures,
  setMobileView
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
