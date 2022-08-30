import { connect } from 'react-redux';

import { setCurrent, setDrawingValue, setDrawingStatus } from 'modules/drawing-tool/actions';

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.drawingTool.current,
  drawingValue: state.drawingTool.drawingValue,
});

const mapDispatchToProps = {
  setCurrent,
  setDrawingValue,
  setDrawingStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
