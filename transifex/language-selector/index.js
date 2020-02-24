
import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';
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
