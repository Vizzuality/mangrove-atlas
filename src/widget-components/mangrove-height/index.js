import { connect } from 'react-redux';

import config from './config';
import Component from './component';

const mapStateToProps = state => ({
  data: [],
  config
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
