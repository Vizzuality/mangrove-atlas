import { connect } from "react-redux";

import { setDrawingMode, setDrawingValue, setCustomGeojsonFeatures } from "modules/drawing-tool/actions";

import Component from "./component";

const mapStateToProps = (state) => ({
  locationType: state.router.type,
  drawingMode: state.drawingTool.drawingMode,
  openModal: state.locations.isOpened,
  drawingValue: state.drawingTool.drawingValue,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures
});

const mapDispatchToProps = {
  setDrawingMode,
  setDrawingValue,
  setCustomGeojsonFeatures
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
