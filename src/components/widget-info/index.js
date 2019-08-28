
import { connect } from 'react-redux';
import { openInfoPanel } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  isOpened: state.widgets.isOpened,
});

const mapDispatchToProps = {
  openInfoPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
