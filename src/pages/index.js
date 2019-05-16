import { connect } from 'react-redux';
import Layout from 'pages/layout';

export default connect(
    state => ({
          page: state.page
        })
)(Layout);
