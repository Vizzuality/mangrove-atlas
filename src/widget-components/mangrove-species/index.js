import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import { fetchMangroveSpeciesData } from 'modules/mangrove-species-data/actions';
<<<<<<< HEAD
=======
import { getLocationType } from 'modules/pages/sagas';
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveSpeciesData.isLoading,
  data: state.mangroveSpeciesData.data,
<<<<<<< HEAD
  ui: state.widgets.ui.blue_carbon,
  locationsList: state.locations.list,
=======
  ui: state.widgets.ui.species,
  locationsList: state.locations.list,
  currentLocationId: state.locations.currentId,
  current: state.locations.current.id || state.locations.current.iso,
  locationType: getLocationType(state.router.type),
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveSpeciesData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
