import { connect } from 'react-redux';
import { setMobileView } from 'modules/map/actions';
import { activeLayers } from 'modules/widgets/selectors';
import Component from './component';

const mapStateToProps = state => ({
  mapView: state.app.mobile.mapView,
  activeLayers: activeLayers(state)
});

const mapDispatchToProps = {
  setMobileView
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
