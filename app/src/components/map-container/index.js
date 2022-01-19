import { connect } from 'react-redux';
import { setViewport, setPopup, removePopup } from 'modules/map/actions';
import { mapStyle } from 'modules/map-styles/selectors';
import { highlightedPlaces, currentLocation } from 'modules/locations/selectors';
import { pageActions } from 'modules/pages/actions';

import Component from './component';

const mapStateToProps = state => ({
  ...state.map,
  mapStyle: mapStyle(state),
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  isCollapse: state.layers.isCollapsed,
  data: highlightedPlaces(state),
  currentLocation: currentLocation(state),
});

const mapDispatchToProps = {
  setViewport,
  setPopup,
  removePopup,
  goToCountry: pageActions['PAGE/COUNTRY'],
  goToAOI: pageActions['PAGE/AOI']
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
