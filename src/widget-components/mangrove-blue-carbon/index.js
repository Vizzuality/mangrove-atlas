import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';

import { fetchMangroveBlueCarbonData } from 'modules/mangrove-blue-carbon-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveBlueCarbonData.isLoading,
  data: state.mangroveBlueCarbonData.data,
  metadata: state.mangroveBlueCarbonData.metadata,
  ui: state.widgets.ui.blue_carbon,
  drawingValue: state.drawingTool.drawingValue,
  drawingMode: state.drawingTool.drawingMode
});

const mapDispatchToProps = {
  setUi,
  fetchMangroveBlueCarbonData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
