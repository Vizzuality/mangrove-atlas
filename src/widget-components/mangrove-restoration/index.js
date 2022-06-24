import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';
import { fetchMangroveRestorationData } from 'modules/mangrove-restoration-data/actions';
import { fetchMangroveDegradationAndLossData } from 'modules/mangrove-degradation-and-loss-data/actions';
import { fetchMangroveEcosystemServicesData } from 'modules/mangrove-ecosystem-services-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveRestorationData.isLoading,
  ui: state.widgets.ui,
  restorationData: state.mangroveRestorationData.data.data,
  restorationDataMetadata: state.mangroveRestorationData.data.metadata,
  degradationAndLossData: state.mangroveDegradationAndLossData.data,
  ecosystemServicesData: state.mangroveEcosystemServicesData.data
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveRestorationData,
  fetchMangroveDegradationAndLossData,
  fetchMangroveEcosystemServicesData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
