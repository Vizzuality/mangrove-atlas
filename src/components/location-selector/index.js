import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import Header from './component';

const mapStateToProps = state => ({
  location: currentLocation(state),
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
