import { connect } from 'react-redux';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets } from 'modules/widgets/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';

import Component from './component';

// todo: widgets are processed here so content can get customized
const mapStateToProps = state => ({
  widgets: dashboardWidgets(state)
});

const mapDispatchToProps = {
  fetchDashboards,
  fetchWidgets
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
