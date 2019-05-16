import { connect } from 'react-redux';
import { setMapViewport, setMapBounds } from 'modules/map/actions';
// import { setFullscreen } from 'modules/fullscreen/actions';

import MapComponent from './component';

export default connect(
  state => ({
    ...state.map
  }),
  {
    // setFullscreen,
    setMapViewport,
    setMapBounds
  }
)(MapComponent);
