import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import { setSearchActive } from 'modules/app/actions';
import Header from './component';

const mapStateToProps = state => ({
  location: currentLocation(state),
});

const mapDispatchToProps = {
  setSearchActive
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
