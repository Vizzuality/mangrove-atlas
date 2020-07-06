import { connect } from 'react-redux';
import { fetchAlerts } from 'modules/alerts/actions';
import { setUi } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveData.isLoading,
  data: state.mangroveData.list,
  ui: state.widgets.ui.height || '2016'
});

const mapDispatchToProps = { setUi, fetchAlerts };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
