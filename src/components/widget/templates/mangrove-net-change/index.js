import { connect } from 'react-redux';
import { netChangeWidget } from 'modules/widgets/selectors';
import { currentLocation } from 'modules/locations/selectors';
import Component from './component';

const mapStateToProps = state => ({
  data: netChangeWidget(state),
  location: currentLocation(state)
});

export default connect(mapStateToProps)(Component);
