import { connect } from 'react-redux';
import { dashboardWidgets } from 'modules/widgets/selectors';
import Component from './component';

const mapStateToProps = state => ({
  widgets: dashboardWidgets(state)
});


export default connect(mapStateToProps)(Component);
