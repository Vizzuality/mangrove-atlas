import { connect } from 'react-redux';
import { fetchRankingData } from 'modules/ranking/actions';

import config from './config';
import Component from './component';

const mapStateToProps = state => ({
  data: config.parse(state.ranking)
});

const mapDispatchToProps = {
  fetchRankingData
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
