import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  filters: state.mapStyles.filters,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
