import { connect } from 'react-redux';
import { activeLayersForLegend } from 'modules/layers/selectors';
import { toggleCollapse } from 'modules/layers/actions';
import Component from './component';

const mapStateToProps = state => ({
  layers: activeLayersForLegend(state),
  isCollapsed: state.layers.isCollapsed
});

const mapDispatchToProps = {
  toggleCollapse
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
