import { connect } from 'react-redux';
import { toggleCollapse, toggleActive } from 'modules/widgets/actions';
import { currentLocation } from 'modules/locations/selectors';
import Widget from './component';

const mapStateToProps = state => ({
  location: currentLocation(state),
  isLoading: state.dashboards.isLoading || state.locations.isLoading
});

const mapDispatchToProps = {
  toggleCollapse,
  toggleActive
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
