import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import { conservationHotspots } from 'modules/widgets/selectors';
import { closeSearchPanel } from 'modules/locations/actions';
import Component from './component';

const mapStateToProps = state => ({
  isOpened: state.locations.isOpened,
  currentLocation: currentLocation(state),
  conservationHotspots: conservationHotspots(state),
  locations: state.locations.list
});

const mapDispatchToProps = {
  closeSearchPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
