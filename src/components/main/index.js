import { connect } from 'react-redux';

import Main from './component';

const mapStateToProps = state => ({
  isSearchActive: state.app.isSearchActive
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
