import { connect } from 'react-redux';
import { setViewport, removePopup } from 'modules/map/actions';
import { mapStyle } from 'modules/map-styles/selectors';
import { pageActions } from 'modules/pages/actions';

import Component from './component';

const mapStateToProps = state => ({
  ...state.map,
  mapStyle: mapStyle(state),
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  isCollapse: state.layers.isCollapsed,
  bounds: state.map.bounds,
});

const mapDispatchToProps = {
  setViewport,
  removePopup,
  goToCountry: pageActions['PAGE/COUNTRY'],
  goToWDPA: pageActions['PAGE/WDPA'],
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
