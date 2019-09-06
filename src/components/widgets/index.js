import { connect } from 'react-redux';
import { expandAll, collapseAll, toggleCollapse, toggleActive } from 'modules/widgets/actions';
import { addFilter, removeFilter } from 'modules/map-styles/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';
import { currentLocation, highlightedPlaces } from 'modules/locations/selectors';
import Component from './component';

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  isCollapsed: state.widgets.isCollapsed,
  isLoading: state.mangroveData.isLoading,
  highlightedPlaces: highlightedPlaces(state),
  widgets: dashboardWidgets(state),
  widgetData: state.mangroveData,
});

const mapDispatchToProps = {
  expandAll,
  collapseAll,
  toggleCollapse,
  toggleActive,
  addFilter,
  removeFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
