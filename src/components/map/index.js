import { connect } from 'react-redux';
import { setViewport } from 'modules/map/actions';
import { mapStyle } from 'modules/map-styles/selectors';

import Component from './component';

const mapStateToProps = state => ({
  ...state.map,
  mapStyle: mapStyle(state),
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
});

const mapDispatchToProps = {
  setViewport
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
