import { connect } from 'react-redux';
import { expandAll, collapseAll } from 'modules/widgets/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';
import { currentLocation } from 'modules/locations/selectors';
import Component from './component';

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  widgets: dashboardWidgets(state),
});

const mapDispatchToProps = {
  expandAll,
  collapseAll
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
