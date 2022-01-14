import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveSpeciesData.isLoading,
  data: state.mangroveSpeciesData,
  ui: state.widgets.ui.blue_carbon
});

const mapDispatchToProps = {
  setUi
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
