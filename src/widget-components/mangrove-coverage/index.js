import { connect } from 'react-redux';

import config from './config';
import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveData.isLoading,
  data: config.parse(state.mangroveData)
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
