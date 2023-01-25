import { connect } from 'react-redux';

import {
  setDrawingMode, setDrawingValue, setCustomGeojsonFeatures, setCurrent as setCurrentStatus,
} from 'modules/drawing-tool/actions';
import { closeSearchPanel, openSearchPanel, setCurrent as setCurrentLocation } from 'modules/locations/actions';

import { setViewport } from 'modules/map/actions';

import Component from './component';

const mapStateToProps = (state) => ({
  locationType: state.router.type,
  drawingMode: state.drawingTool.drawingMode,
  openModal: state.locations.isOpened,
  drawingValue: state.drawingTool.drawingValue,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures,
  locationsModal: state.locations.isOpened,
  currentLocation: state.locations.current,
  router: state.router,
  mapView: state.app.mobile.mapView,
  viewport: state.map.viewport,
});

const mapDispatchToProps = {
  setCurrentLocation,
  setDrawingMode,
  setDrawingValue,
  setCustomGeojsonFeatures,
  setCurrentStatus,
  closeSearchPanel,
  openSearchPanel,
  setViewport,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
