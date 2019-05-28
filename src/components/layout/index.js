import { connect } from 'react-redux';
import Layout from './component';

export default connect(
  state => ({
    page: state.page.current
  })
)(Layout);
