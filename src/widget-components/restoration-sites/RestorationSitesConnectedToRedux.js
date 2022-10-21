import { connect } from 'react-redux';
import { fetchRestorationSites } from 'modules/restorationSites/restorationSitesActions';
import RestorationSites from './RestorationSites';

const mapStateToProps = state => ({
  data: state.restorationSites.data,
  isLoading: state.alerts.isLoading,
});

const mapDispatchToProps = { fetchRestorationSites };

export default connect(mapStateToProps, mapDispatchToProps)(RestorationSites);
