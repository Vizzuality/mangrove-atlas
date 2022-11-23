import { connect } from "react-redux";

import { setDrawingMode, setDrawingValue, setCustomGeojsonFeatures } from "modules/drawing-tool/actions";
import { closeSearchPanel, setCurrent as setCurrentLocation } from "modules/locations/actions";

import Component from "./component";

const mapStateToProps = (state) => ({
  locationType: state.router.type,
  drawingMode: state.drawingTool.drawingMode,
  openModal: state.locations.isOpened,
  drawingValue: state.drawingTool.drawingValue,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures,
  locationsModal: state.locations.isOpened,
  currentLocation: state.locations.current,
});

const mapDispatchToProps = {
  setCurrentLocation,
  setDrawingMode,
  setDrawingValue,
  setCustomGeojsonFeatures,
  closeSearchPanel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
