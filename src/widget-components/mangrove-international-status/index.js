import { connect } from 'react-redux';

import { fetchMangroveInternationalStatusData } from "modules/mangrove-international-status-data/actions";

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveInternationalStatusData.isLoading,
  data: state.mangroveInternationalStatusData.data,
  locationsList: state.locations.list,
  current: state.locations.current.id || state.locations.current.iso,
  type: state.router.type,
});
const mapDispatchToProps = { fetchMangroveInternationalStatusData };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
