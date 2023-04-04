import { connect } from 'react-redux';

import { fetchMangroveInternationalStatusData } from "modules/mangrove-international-status-data/actions";

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveInternationalStatusData.isLoading,
  data: state.mangroveInternationalStatusData.data[0],
  locationsList: state.locations.list,
});
const mapDispatchToProps = { fetchMangroveInternationalStatusData };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
