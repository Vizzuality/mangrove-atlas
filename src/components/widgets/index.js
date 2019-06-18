import { connect } from 'react-redux';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets, expandAll, collapseAll } from 'modules/widgets/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';

import Component from './component';

// todo: widgets are processed here so content can get customized
const mapStateToProps = state => ({
  isCollapsed: state.widgets.isCollapsed,
  widgets: dashboardWidgets(state)
});

const mapDispatchToProps = {
  fetchDashboards,
  fetchWidgets,
  collapseAll,
  expandAll
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
