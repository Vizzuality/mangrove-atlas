import { connect } from 'react-redux';

import { getActiveLayers } from 'modules/layers/selectors';
import Main from './component';

const mapStateToProps = state => ({
  isSearchActive: state.app.isSearchActive,
  layers: getActiveLayers(state)
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
