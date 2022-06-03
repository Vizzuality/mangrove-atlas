import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import { fetchMangroveSpeciesData } from 'modules/mangrove-species-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveSpeciesData.isLoading,
  data: state.mangroveSpeciesData,
  ui: state.widgets.ui.blue_carbon,
  locationsList: state.locations.list,
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveSpeciesData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
