import { connect } from 'react-redux';
import { setMapViewport, setMapBounds, setMapLoaded, setMapFlying } from 'modules/map/actions';

import Map from './component';

const envVars = {
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_TOKEN
};

const mapStateToProps = state => ({
  ...state.map,
  ...envVars
});

const mapDispatchToProps = {
  setMapViewport,
  setMapBounds,
  setMapLoaded,
  setMapFlying
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
