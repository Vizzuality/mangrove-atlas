import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import { fetchMangroveEmissionsMitigationData } from 'modules/mangrove-emissions-mitigation-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveEmissionsMitigationData.isLoading,
  data: state.mangroveEmissionsMitigationData.data,
  ui: state.widgets.ui.species,
  locationsList: state.locations.list,
  currentLocationId: state.locations.currentId,
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveEmissionsMitigationData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
