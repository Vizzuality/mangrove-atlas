import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import { conservationHotspots } from 'modules/widgets/selectors';
import Component from './component';

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  conservationHotspots: conservationHotspots(state)
});

export default connect(mapStateToProps)(Component);
