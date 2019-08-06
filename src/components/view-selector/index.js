import { connect } from 'react-redux';
import { setMapView } from 'modules/map/actions';
import Component from './component';

const mapStateToProps = state => ({
  mapView: state.map.display
});

const mapDispatchToProps = {
  setMapView
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
