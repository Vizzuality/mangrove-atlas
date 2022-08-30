import { connect } from 'react-redux';

import { setCurrent } from 'modules/dashboards/actions';
import { currentDashboard } from 'modules/dashboards/selectors';

import Component from './component';

const mapStateToProps = state => ({
  currentDashboard: currentDashboard(state),
  dashboards: state.dashboards.list,
  disabled: state.drawingTool.drawingMode
});

const mapDispatchToProps = {
  setCurrent,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
