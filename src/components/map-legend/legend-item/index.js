import { connect } from 'react-redux';

import { toggleActive } from 'modules/layers/actions';
import { toggleActiveByLayerId as toggleWidgetActive } from 'modules/widgets/actions';
import { setDrawingValue, setCurrent as setDrawingStatus, setCustomGeojsonFeatures } from 'modules/drawing-tool/actions';
import { setCurrent } from 'modules/locations/actions';
import { setViewport } from 'modules/map/actions';

import Component from './component';

const mapStateToProps = (state) => ({
  isCollapsed: state.layers.isCollapsed,
  mapView: state.app.mobile.mapView,
});

const mapDispatchToProps = {
  toggleActive,
  toggleWidgetActive,
  setDrawingValue,
  setCustomGeojsonFeatures,
  setCurrent,
  setDrawingStatus,
  setViewport,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
