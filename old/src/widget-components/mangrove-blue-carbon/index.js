import { connect } from 'react-redux';

import { fetchMangroveBlueCarbonData } from 'modules/mangrove-blue-carbon-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveBlueCarbonData.isLoading,
  data: state.mangroveBlueCarbonData.data,
  metadata: state.mangroveBlueCarbonData.metadata,
  drawingValue: state.drawingTool.drawingValue,
  drawingMode: state.drawingTool.drawingMode,
  customGeojsonFeatures: state.drawingTool.customGeojsonFeatures
});

const mapDispatchToProps = {
  fetchMangroveBlueCarbonData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
