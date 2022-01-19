import { connect } from 'react-redux';
import { currentLocation, highlightedPlaces } from 'modules/locations/selectors';
import { closeSearchPanel } from 'modules/locations/actions';
import Component from './component';

const mapStateToProps = state => ({
  isOpened: state.locations.isOpened,
  currentLocation: currentLocation(state),
  highlightedPlaces: highlightedPlaces(state),
  locations: state.locations.list
});

const mapDispatchToProps = {
  closeSearchPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
