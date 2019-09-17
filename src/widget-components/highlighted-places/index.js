import { connect } from 'react-redux';

import { highlightedPlaces } from 'modules/locations/selectors';

import config from './config';
import Component from './component';

const mapStateToProps = state => ({
  data: config.parse(highlightedPlaces(state)),
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
