import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveProtectionData.isLoading,
  data: state.mangroveProtectionData,
  ui: state.widgets.ui.protection || {
    currentYear: 2016,
    years: [1996, 2007, 2008, 2009, 2015, 2016],
  }
});

const mapDispatchToProps = {
  setUi
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
