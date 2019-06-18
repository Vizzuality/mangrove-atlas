import { connect } from 'react-redux';
import { expandAll, collapseAll } from 'modules/widgets/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';

import Component from './component';

// todo: widgets are processed here so content can get customized
const mapStateToProps = state => ({
  isCollapsed: state.widgets.isCollapsed,
  widgets: dashboardWidgets(state)
});

const mapDispatchToProps = {
  collapseAll,
  expandAll
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
