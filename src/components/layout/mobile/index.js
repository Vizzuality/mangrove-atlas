import { connect } from 'react-redux';
import Component from './component';

const mapStateToProps = state => ({
  mapView: state.app.mobile.mapView
});

export default connect(mapStateToProps)(Component);
