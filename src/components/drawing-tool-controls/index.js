import { connect } from "react-redux";

import { setDrawingMode, setDrawingValue } from "modules/drawing-tool/actions";

import Component from "./component";

const mapStateToProps = (state) => ({
  locationType: state.router.type,
  drawingMode: state.drawingTool.drawingMode,
  openModal: state.locations.isOpened,
  drawingValue: state.drawingTool.drawingValue,
});

const mapDispatchToProps = {
  setDrawingMode,
  setDrawingValue
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
