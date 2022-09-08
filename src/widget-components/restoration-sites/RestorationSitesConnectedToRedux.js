import { connect } from 'react-redux';
import { fetchRestorationSites } from 'modules/restorationSites/restorationSitesActions';
import RestorationSites from './RestorationSitesComponent';

const mapStateToProps = state => ({
  data: state.restorationSites.data,
  isLoading: state.alerts.isLoading,
});

export default connect(mapStateToProps, {})(RestorationSites);
