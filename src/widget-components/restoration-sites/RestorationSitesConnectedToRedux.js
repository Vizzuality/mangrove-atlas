import { connect } from 'react-redux';
import RestorationSites from './RestorationSitesComponent';

const mapStateToProps = state => ({
  data: state.restorationSites.data,
  isLoading: state.alerts.isLoading,
});

export default connect(mapStateToProps, {})(RestorationSites);
