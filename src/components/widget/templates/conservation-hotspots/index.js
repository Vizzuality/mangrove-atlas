import { connect } from 'react-redux';
import { currentLocation, highlightedAreas } from 'modules/locations/selectors';
import { conservationHotspots } from 'modules/widgets/selectors';
import Component from './component';

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  conservationHotspots: highlightedAreas(state),
});

export default connect(mapStateToProps)(Component);
