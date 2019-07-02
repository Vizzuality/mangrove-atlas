import { connect } from 'react-redux';
import { activeLayersForLegend } from 'modules/layers/selectors';
import Component from './component';

const mapStateToProps = state => ({
  layers: activeLayersForLegend(state)
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
