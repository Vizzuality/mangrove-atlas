import { connect } from 'react-redux';
import { currentLocation } from 'modules/locations/selectors';
import { openSearchPanel } from 'modules/locations/actions';
import Component from './component';

const mapStateToProps = state => ({
  location: currentLocation(state),
  isMobile: state.app.isMobile
});

const mapDispatchToProps = {
  openSearchPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
