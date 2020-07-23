import { connect } from 'react-redux';
import { fetchRankingData } from 'modules/ranking/actions';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  data: state.ranking,
  isLoading: state.ranking.isLoading,
  ui: state.widgets.ui.activity || {
    startDate: 2007,
    endDate: 2016,
    filter: 'gain',
    order: 'desc',
    limit: 5
  }
});

const mapDispatchToProps = {
  fetchRankingData,
  setUi
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
