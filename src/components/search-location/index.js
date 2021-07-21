import { connect } from 'react-redux';
import { openSearchPanel } from 'modules/locations/actions';
import Component from './component';

const mapDispatchToProps = {
  openSearchPanel,
};

export default connect(null, mapDispatchToProps)(Component);
