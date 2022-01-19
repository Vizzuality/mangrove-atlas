import { connect } from 'react-redux';
import { toggleCollapse } from 'modules/layers/actions';
import Component from './component';

const mapStateToProps = state => ({
  isCollapsed: state.layers.isCollapsed
});

const mapDispatchToProps = {
  toggleCollapse
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
