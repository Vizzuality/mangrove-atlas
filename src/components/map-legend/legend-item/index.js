import { connect } from 'react-redux';
import { toggleActive } from 'modules/layers/actions';
import Component from './component';

const mapDispatchToProps = {
  toggleActive
};

export default connect(null, mapDispatchToProps)(Component);
