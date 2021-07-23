import { connect } from 'react-redux';

import { currentLocation } from 'modules/locations/selectors';
import { openSearchPanel } from 'modules/locations/actions';
import { setMobileView } from 'modules/app/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';
import { expandAll, collapseAll } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  mapView: state.app.mobile.mapView,
  location: currentLocation(state),
  isCollapsed: state.widgets.isCollapse,
  widgets: dashboardWidgets(state),
});

const mapDispatchToProps = {
  openSearchPanel,
  collapseAll,
  expandAll,
  setMobileView
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
