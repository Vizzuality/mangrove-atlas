import { connect } from 'react-redux';
import { fetchRankingData } from 'modules/ranking/actions';

import Component from './component';

const mapStateToProps = state => ({
  data: state.ranking,
  isLoading: state.ranking.isLoading
});

const mapDispatchToProps = {
  fetchRankingData
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
