import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import Component from './component';

const mapStateToProps = state => ({
  location: currentLocation(state)
});

export default connect(mapStateToProps)(Component);
