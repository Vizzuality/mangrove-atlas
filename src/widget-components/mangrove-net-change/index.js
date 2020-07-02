import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveData.isLoading,
  data: state.mangroveData,
  ui: state.widgets.ui.net || {
    range: { startYear: '1996', endYear: '2016' },
    currentYear: '2016',
    years: [1996, 2007, 2008, 2009, 2015, 2016],
    unit: 'km'
  }
});

const mapDispatchToProps = {
  setUi
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
