import { connect } from 'react-redux';

import Component from './component';

import data from './alerts.json';

const mapStateToProps = () => ({ data });

export default connect(mapStateToProps)(Component);
