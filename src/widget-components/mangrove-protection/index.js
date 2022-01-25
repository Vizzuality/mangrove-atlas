import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';
import { fetchMangroveProtectionData } from 'modules/mangrove-protection-data/actions';


import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveProtectionData.isLoading,
  data: state.mangroveProtectionData.data,
  ui: state.widgets.ui.protection,
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveProtectionData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
