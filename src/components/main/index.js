import { connect } from 'react-redux';

import Main from './component';
import { getActiveLayers } from 'modules/layers/selectors';

const mapStateToProps = state => ({
  isSearchActive: state.app.isSearchActive,
  layers: getActiveLayers(state)
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
