import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  filters: state.mapStyles.filters,
  currentMode: state.drawingTool.current,
  drawingMode: state.drawingTool.drawingMode,
  drawingValue: state.drawingTool.drawingValue
});

export default connect(mapStateToProps)(Component);
