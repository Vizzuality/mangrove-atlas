import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  filters: state.mapStyles.filters,
  currentMode: state.drawingTool.current,
});

export default connect(mapStateToProps)(Component);
