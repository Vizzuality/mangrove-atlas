import { connect } from 'react-redux';

import {
  setSearchActive
} from 'modules/app/actions';
import Header from './component';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  setSearchActive
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
