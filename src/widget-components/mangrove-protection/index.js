import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';
import { fetchMangroveProtectionData } from 'modules/mangrove-protection-data/actions';


import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveProtectionData.isLoading,
  data: state.mangroveProtectionData,
  ui: state.widgets.ui.protection || {
    currentYear: 2020,
  }
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveProtectionData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
