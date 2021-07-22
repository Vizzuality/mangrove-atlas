import { connect } from 'react-redux';
import { toggleActive } from 'modules/widgets/actions';
import { toggleCollapse } from 'modules/layers/actions';
import Component from './component';

const mapDispatchToProps = {
  toggleActive,
  toggleCollapse,
};

export default connect(null, mapDispatchToProps)(Component);
