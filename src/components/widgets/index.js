import { connect } from 'react-redux';
import { expandAll, collapseAll, toggleCollapse, toggleActive } from 'modules/widgets/actions';
import { addFilter, removeFilter } from 'modules/map-styles/actions';
import { fetchRankingData } from 'modules/ranking/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';
import { currentLocation, highlightedPlaces } from 'modules/locations/selectors';
import Component from './component';

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  isLoading: state.mangroveData.isLoading,
  highlightedPlaces: highlightedPlaces(state),
  widgets: dashboardWidgets(state),
  widgetData: state.mangroveData,
  rankingData: state.ranking
});

const mapDispatchToProps = {
  expandAll,
  collapseAll,
  toggleCollapse,
  toggleActive,
  addFilter,
  removeFilter,
  fetchRankingData
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
