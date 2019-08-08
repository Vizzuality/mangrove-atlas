import { connect } from 'react-redux';
import { setBasemap } from 'modules/map/actions';

import Component from './component';

const mapStateToProps = state => ({
  basemapName: state.map.basemap,
  isCollapsed: state.layers.isCollapsed
});

const mapDispatchToProps = {
  setBasemap
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
