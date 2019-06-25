import { connect } from 'react-redux';
import { coverageWidget } from 'modules/widgets/selectors';
import { currentLocation } from 'modules/locations/selectors';
import Component from './component';

const mapStateToProps = state => ({
  data: coverageWidget(state),
  location: currentLocation(state)
});

export default connect(mapStateToProps)(Component);
