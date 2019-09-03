import { connect } from 'react-redux';
import { setViewport } from 'modules/map/actions';
import { mapStyle } from 'modules/map-styles/selectors';
import { pageActions } from 'modules/pages/actions';

import Component from './component';

const mapStateToProps = state => ({
  ...state.map,
  mapStyle: mapStyle(state),
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  isCollapse: state.layers.isCollapsed
});

const mapDispatchToProps = {
  setViewport,
  goToCountry: pageActions['PAGE/COUNTRY'],
  goToAOI: pageActions['PAGE/AOI']
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
