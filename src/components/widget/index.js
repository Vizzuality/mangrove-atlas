import { connect } from 'react-redux';
import { toggleCollapse, toggleActive } from 'modules/widgets/actions';
import Widget from './component';

const mapStateToProps = state => ({
  isLoading: state.dashboards.isLoading || state.locations.isLoading
});

const mapDispatchToProps = {
  toggleCollapse,
  toggleActive
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
