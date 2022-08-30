import { connect } from 'react-redux';
import { activeLayersForLegend } from 'modules/layers/selectors';
import { toggleCollapse } from 'modules/layers/actions';
import Component from './component';

const mapStateToProps = state => ({
  layers: activeLayersForLegend(state),
  isCollapsed: state.layers.isCollapsed,
  drawingValue: state.drawingTool.drawingValue,
  drawingStatus: state.drawingTool.drawingStatus
});

const mapDispatchToProps = {
  toggleCollapse
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
