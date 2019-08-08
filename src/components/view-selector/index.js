import { connect } from 'react-redux';
import { setMapView } from 'modules/map/actions';
import { activeLayers } from 'modules/widgets/selectors';
import Component from './component';

const mapStateToProps = state => ({
  mapView: state.map.display,
  activeLayers: activeLayers(state)
});

const mapDispatchToProps = {
  setMapView
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
