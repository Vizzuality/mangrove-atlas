import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveData.isLoading,
  data: state.mangroveData,
  ui: state.widgets.ui.net
});

const mapDispatchToProps = {
  setUi
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
