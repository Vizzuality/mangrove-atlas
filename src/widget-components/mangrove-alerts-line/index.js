import { connect } from 'react-redux';
import { fetchAlerts } from 'modules/alerts/actions';
import { setUi } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  data: state.alerts,
  isLoading: state.ranking.isLoading,
  ui: state.widgets.ui.alerts || {
    id: ''
  }
});

const mapDispatchToProps = { setUi, fetchAlerts };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
