import { connect } from 'react-redux';

import { expandAll } from 'modules/widgets/actions';
import { fetchMangroveHabitatExtentData } from 'modules/mangrove-habitat-extent-data/actions';
import { fetchMangroveNetChangeData } from 'modules/mangrove-net-change-data/actions';
import { fetchMangroveHeightData } from 'modules/mangrove-height-data/actions';
import { fetchMangroveBiomassData } from 'modules/mangrove-biomass-data/actions';
import { fetchMangroveBlueCarbonData } from 'modules/mangrove-blue-carbon-data/actions';
import { fetchAlerts } from 'modules/alerts/actions';
import {
  setCurrent, setDrawingValue, setDrawingMode, setDrawingStatus, setCustomGeojsonFeatures,
} from 'modules/drawing-tool/actions';
import { setCurrent as setCurrentLocation } from 'modules/locations/actions';
import { setBounds, setViewport } from 'modules/map/actions';
import { setMobileView } from 'modules/app/actions';

import Component from './component';

const mapStateToProps = (state) => ({
  current: state.drawingTool.current,
  drawingMode: state.drawingTool.drawingMode,
  drawingValue: state.drawingTool.drawingValue,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures,
  mapView: state.app.mobile.mapView,
  alertsUi: state.widgets.ui.alerts,
  viewport: state.map.viewport,
  zoom: state.router.query.zoom,
});

const mapDispatchToProps = {
  setCurrent,
  setCurrentLocation,
  setDrawingValue,
  setDrawingMode,
  setDrawingStatus,
  setViewport,
  expandAll,
  fetchMangroveHabitatExtentData,
  fetchMangroveNetChangeData,
  fetchMangroveHeightData,
  fetchMangroveBiomassData,
  fetchMangroveBlueCarbonData,
  fetchAlerts,
  setCustomGeojsonFeatures,
  setBounds,
  setMobileView,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
