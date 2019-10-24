import { connect } from 'react-redux';
import moment from 'moment';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

import data from './alerts.json';

const mapStateToProps = state => ({
  data,
  ui: state.widgets.ui.alerts || {
    startDate: moment('2019-01-01').add(2, 'M').toISOString(),
    endDate: moment('2019-12-31').subtract(2, 'M').toISOString()
  }
});
const mapDispatchToProps = { setUi };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
