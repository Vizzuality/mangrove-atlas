import { connect } from 'react-redux';

import { setUi } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveData.isLoading,
  data: state.mangroveData.list,
  ui: state.widgets.ui.height || '2016'
});

const mapDispatchToProps = { setUi };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
