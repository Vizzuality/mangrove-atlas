import { connect } from 'react-redux';
import RestorationSites from './RestorationSites';

const mapStateToProps = state => ({
  isLoading: state.alerts.isLoading,
});

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(RestorationSites);
