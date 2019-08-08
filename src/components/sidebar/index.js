import { connect } from 'react-redux';
import { setHeader } from 'modules/pages/actions';
import Component from './component';

const mapStateToProps = state => ({
  header: state.page.header
});

const mapDispatchToProps = {
  setHeader
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
