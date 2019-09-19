import { connect } from 'react-redux';
import { toggleCollapse, toggleActive } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  isLocationsModal: state.locations.isOpened
});

const mapDispatchToProps = {
  toggleCollapse,
  toggleActive
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
