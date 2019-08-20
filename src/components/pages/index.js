import { connect } from 'react-redux';
import { initializeApp } from 'modules/app/actions';
import Component from './component';

const stateToProps = ({ page }) => ({ page });
const dispatchToProps = { initializeApp };

export default connect(
  stateToProps,
  dispatchToProps
)(Component);
