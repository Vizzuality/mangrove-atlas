import { connect } from 'react-redux';
import { fetchLanguages, setCurrentLanguage } from 'modules/languages/actions';
import Component from './component';

const mapStateToProps = state => ({
  language: state.languages.current,
  data: state.languages.list,
});

const mapDispatchToProps = {
  fetchLanguages,
  setCurrentLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
