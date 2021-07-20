import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import { openSearchPanel } from 'modules/locations/actions';
import { expandAll, collapseAll } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  location: currentLocation(state),
  isCollapsed: state.widgets.isCollapsed
});

const mapDispatchToProps = {
  openSearchPanel,
  collapseAll,
  expandAll
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
