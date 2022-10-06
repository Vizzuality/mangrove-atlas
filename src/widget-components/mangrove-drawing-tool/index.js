import { connect } from 'react-redux';

import { expandAll } from 'modules/widgets/actions';
import { fetchMangroveHabitatExtentData } from 'modules/mangrove-habitat-extent-data/actions';
import { setCurrent, setDrawingValue, setDrawingMode, setDrawingStatus } from 'modules/drawing-tool/actions';
import { setCurrent as setCurrentLocation } from "modules/locations/actions";

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.drawingTool.current,
  drawingMode: state.drawingTool.drawingMode,
  drawingValue: state.drawingTool.drawingValue,
});

const mapDispatchToProps = {
  setCurrent,
  setCurrentLocation,
  setDrawingValue,
  setDrawingMode,
  setDrawingStatus,
  expandAll,
  fetchMangroveHabitatExtentData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
