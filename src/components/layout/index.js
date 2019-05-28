import { connect } from 'react-redux';
import Layout from './component';

export default connect(
  ({ page }) => ({ page })
)(Layout);
