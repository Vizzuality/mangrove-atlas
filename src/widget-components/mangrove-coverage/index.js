import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveData.isLoading,
  data: state.mangroveData
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
