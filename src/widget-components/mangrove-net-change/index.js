import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import { getLocationType } from 'modules/pages/sagas';
import { fetchMangroveNetChangeData } from 'modules/mangrove-net-change-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveNetChangeData.isLoading,
  data: state.mangroveNetChangeData,
  ui: state.widgets.ui.net,
  current: state.locations.current,
  currentLocationId: state.locations.currentId?.location_id,
  locations: state.locations.list,
  locationType: getLocationType(state.router.type)
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveNetChangeData
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
