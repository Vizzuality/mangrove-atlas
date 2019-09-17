import { connect } from 'react-redux';
import { expandAll, collapseAll, toggleCollapse, toggleActive } from 'modules/widgets/actions';
import { addFilter, removeFilter } from 'modules/map-styles/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';
import { currentLocation } from 'modules/locations/selectors';
import Component from './component';

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  widgets: dashboardWidgets(state),
});

const mapDispatchToProps = {
  expandAll,
  collapseAll,
  toggleCollapse,
  toggleActive,
  addFilter,
  removeFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
