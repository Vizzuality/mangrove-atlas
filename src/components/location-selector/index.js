import { connect } from 'react-redux';
import { fetchLocations } from 'modules/locations/actions';
import { currentLocation } from 'modules/locations/selectors';
import { setSearchActive } from 'modules/app/actions';
import Header from './component';

const mapStateToProps = state => ({
  location: currentLocation(state),
});

const mapDispatchToProps = {
  setSearchActive,
  fetchLocations
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
