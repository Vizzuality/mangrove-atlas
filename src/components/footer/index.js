import { connect } from 'react-redux';

import {
  pageActions
} from 'modules/pages/actions';
import Footer from './component';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  setLocationPage: pageActions.LOCATION
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
