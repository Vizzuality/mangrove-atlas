import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  filters: state.mapStyles.filters,
});

export default connect(mapStateToProps)(Component);
