import { connect } from 'react-redux';
import Component from './component';

const mapStateToProps = state => ({
  mapView: state.app.mobile.map,
});

export default connect(mapStateToProps)(Component);
