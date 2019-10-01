import { connect } from 'react-redux';

import { highlightedPlaces } from 'modules/locations/selectors';

import Component from './component';

const mapStateToProps = state => ({
  data: highlightedPlaces(state),
});

export default connect(mapStateToProps)(Component);
