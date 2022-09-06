import { connect } from 'react-redux';

// modules
import { setUi, setData } from 'modules/widgets/actions';
import { fetchMangroveHeightData } from 'modules/mangrove-height-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveHeightData.isLoading,
  data: state.mangroveHeightData.data,
  metadata: state.mangroveHeightData.metadata,
  ui: state.widgets.ui.height
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveHeightData,
  setData
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);