
import { connect } from 'react-redux';
import * as actions from 'modules/transifex/actions';
import { fetchLanguages, setCurrentLanguage } from 'modules/transifex/actions';
import * as reducers from 'modules/transifex/reducers';
import initialState from 'modules/transifex/initial-state';
import Component from './component';

export { actions, reducers, initialState };

const mapStateToProps = state => ({
  language: state.page.language,
  data: state.page.data,
});

const mapDispatchToProps = dispatch => ({
  fetchLanguages,
  setLanguage: language => dispatch(setCurrentLanguage(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
