import { connect } from 'react-redux';
import * as actions from 'modules/languages/actions';

import * as reducers from 'modules/languages/reducers';
import initialState from 'modules/languages/initial-state';
import Component from './component';

export { actions, reducers, initialState };

const mapStateToProps = state => ({
  current: state.languages.current,
  data: state.languages.data,
});

const mapDispatchToProps = dispatch => ({
  fetchLanguages: () => dispatch(actions.fetchLanguages()),
  setLanguage: language => dispatch(actions.setCurrentLanguage(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
