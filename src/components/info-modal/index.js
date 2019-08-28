import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import { closeInfoPanel } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  isOpened: state.widgets.isOpened,
  currentLocation: currentLocation(state),
  locations: state.locations.list,
  widgetType: state.widgets.type
});

const mapDispatchToProps = {
  closeInfoPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
