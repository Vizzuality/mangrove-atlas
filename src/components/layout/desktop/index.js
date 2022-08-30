import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = (state) => ({
  drawingMode: state.drawingTool.drawingMode,
});

export default connect(mapStateToProps)(Component);
