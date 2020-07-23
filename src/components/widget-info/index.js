
import { connect } from 'react-redux';
import { openInfoPanel } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  isOpened: state.widgets.isOpened,
  current: state.locations.current.iso || state.locations.current.id,
  locationsList: state.locations.list
});

const mapDispatchToProps = {
  openInfoPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
