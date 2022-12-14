import { connect } from 'react-redux';

import { fetchMangroveSpeciesData } from 'modules/mangrove-species-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveSpeciesData.isLoading,
  data: state.mangroveSpeciesData.data,
});

const mapDispatchToProps = {
  fetchMangroveSpeciesData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
