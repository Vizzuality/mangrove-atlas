import { connect } from 'react-redux';

import { expandAll } from 'modules/widgets/actions';
import { setCurrent, setDrawingValue } from 'modules/drawing-tool/actions';

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.drawingTool.current,
  drawingMode: state.drawingTool.drawingMode,
  drawingValue: state.drawingTool.drawingValue,
});

const mapDispatchToProps = {
  setCurrent,
  setDrawingValue,
  expandAll
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
