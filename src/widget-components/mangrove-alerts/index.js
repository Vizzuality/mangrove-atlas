import { connect } from 'react-redux';
import { fetchAlerts } from 'modules/alerts/actions';
import { setUi } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  data: state.alerts,
  isLoading: state.ranking.isLoading,
  currentLocation: state.locations.current,
  locationsList: state.locations.list,
  ui: state.widgets.ui.alerts || {
    alerts: {
      startDate: { label: 'April, 2020', value: '2020-04-01' },
      endDate: { label: 'May, 2020', value: '2020-05-31' },
      year: 2020
    }
  }
});

const mapDispatchToProps = { setUi, fetchAlerts };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
