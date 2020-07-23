import { connect } from 'react-redux';
import { fetchAlerts } from 'modules/alerts/actions';
import { setUi } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  data: state.alerts,
  isLoading: state.ranking.isLoading,
  currentId: state.locations.current.iso,
  locationsList: state.locations.list,
  ui: state.widgets.ui.alerts || {
    alerts: {
      startDate: '2020-04-01',
      endDate: '2020-05-01',
      year: 2020
    }
  }
});

const mapDispatchToProps = { setUi, fetchAlerts };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
