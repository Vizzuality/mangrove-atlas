import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveData.isLoading,
  data: state.mangroveData,
  ui: state.widgets.ui.netChange || {
    startYear: '1996',
    endYear: '2016'
  }
});

const mapDispatchToProps = {
  setUi
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
