import { connect } from 'react-redux';
import { toggleActive } from 'modules/layers/actions';
import Component from './component';

const mapStateToProps = state => ({
  isCollapsed: state.layers.isCollapsed,
  mapView: state.app.mobile.mapView
});

const mapDispatchToProps = {
  toggleActive
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
