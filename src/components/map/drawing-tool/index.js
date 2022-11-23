import { connect } from 'react-redux';

import { setDrawingValue, setDrawingStatus, setCustomGeojsonFeatures } from 'modules/drawing-tool/actions';
import { setMobileView } from 'modules/app/actions';
import { setCurrent as setCurrentLocation } from "modules/locations/actions";

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.drawingTool.current,
  drawingValue: state.drawingTool.drawingValue,
});

const mapDispatchToProps = {
  setCurrentLocation,
  setDrawingValue,
  setDrawingStatus,
  setCustomGeojsonFeatures,
  setMobileView
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
