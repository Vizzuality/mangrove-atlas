import { connect } from 'react-redux';
import { activeLayers } from 'modules/layers/selectors';
import Component from './component';

const mapStateToProps = state => ({
  layers: activeLayers(state)
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
