import { connect } from 'react-redux';
import { coverageWidget } from 'modules/widgets/selectors';
import Widget from './component';

const mapStateToProps = state => ({
  data: coverageWidget(state)
});

export default connect(mapStateToProps)(Widget);
