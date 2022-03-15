import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';
import { fetchMangroveRestorationData } from 'modules/mangrove-restoration-data/actions';


import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveProtectionData.isLoading,
  data: state.mangroveProtectionData.data,
  ui: state.widgets.ui.protection,
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveRestorationData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
