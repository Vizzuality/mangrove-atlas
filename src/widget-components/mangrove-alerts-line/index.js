import { connect } from 'react-redux';
import { fetchAlerts } from 'modules/alerts/actions';
import { setUi } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  data: state.alerts,
  isLoading: state.ranking.isLoading,
  locationId: state.locations.current.iso,
  locationsList: state.locations.list,
  ui: state.widgets.ui.alerts || {
    startDate: 2,
    endDate: 11,
    year: 2019
  }
});

const mapDispatchToProps = { setUi, fetchAlerts };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
