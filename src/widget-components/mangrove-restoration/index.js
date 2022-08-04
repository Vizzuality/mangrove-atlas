import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';
import { fetchMangroveRestorationData } from 'modules/mangrove-restoration-data/actions';
import { fetchMangroveDegradationAndLossData } from 'modules/mangrove-degradation-and-loss-data/actions';
import { fetchMangroveEcosystemServicesData } from 'modules/mangrove-ecosystem-services-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoadingRestorationData: state.mangroveRestorationData.isLoading,
  isLoadingDegradationAndLossData: state.mangroveRestorationData.isLoading,
  ui: state.widgets.ui,
  restorationData: state.mangroveRestorationData.data.data,
  restorationDataMetadata: state.mangroveRestorationData.data.metadata,
  degradationAndLossData: state.mangroveDegradationAndLossData.data,
  degradationAndLossDataMetadata: state.mangroveDegradationAndLossData.metadata,
  ecosystemServicesData: state.mangroveEcosystemServicesData.data,
  ecosystemServicesMetadata: state.mangroveEcosystemServicesData.metadata,
  currentLocationId: state.locations.currentId?.location_id,
  currentId: state.locations.current.id || state.locations.current.iso,
  locations: state.locations,
  type : state.router.type,
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveRestorationData,
  fetchMangroveDegradationAndLossData,
  fetchMangroveEcosystemServicesData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
