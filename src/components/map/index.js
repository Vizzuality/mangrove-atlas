import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  popup: state.map.popup,
  filters: state.mapStyles.filters,
});

export default connect(mapStateToProps)(Component);
