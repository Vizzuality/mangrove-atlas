import { connect } from 'react-redux';
import { closeInfoPanel } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  isOpened: state.widgets.isOpened,
});

const mapDispatchToProps = {
  closeInfoPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
