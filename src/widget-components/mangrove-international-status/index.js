import { connect } from 'react-redux';

import { fetchMangroveInternationalStatusData } from "modules/mangrove-international-status-data/actions";

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveInternationalStatusData.isLoading,
  data: state.mangroveInternationalStatusData.data.filter(d => d.year === 2016),
  locationsList: state.locations.list,
  current: state.locations.current,
  type: state.router.type,
});
const mapDispatchToProps = { fetchMangroveInternationalStatusData };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
