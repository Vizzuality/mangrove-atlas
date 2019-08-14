import { connect } from 'react-redux';
import Component from './component';

export default connect(
  ({ page }) => ({ page })
)(Component);
