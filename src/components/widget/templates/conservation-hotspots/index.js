import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import { conservationHotspots } from 'modules/widgets/selectors';
import Component from './component';

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  data: conservationHotspots(state)
});

export default connect(mapStateToProps)(Component);
