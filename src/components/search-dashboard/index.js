import { connect } from 'react-redux';
import {
  setSearchActive
} from 'modules/app/actions';

import SearchDashboard from './component';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setSearchActive
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchDashboard);
