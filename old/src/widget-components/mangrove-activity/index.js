import { connect } from 'react-redux';
import { fetchRankingData } from 'modules/ranking/actions';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  data: state.ranking.data,
  metadata: state.ranking.metadata,
  isLoading: state.ranking.isLoading,
  ui: state.widgets.ui.activity,
});

const mapDispatchToProps = {
  fetchRankingData,
  setUi
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
