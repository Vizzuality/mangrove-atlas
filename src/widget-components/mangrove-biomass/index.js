import { connect } from "react-redux";
import { setUi } from "modules/widgets/actions";

import { fetchMangroveBiomassData } from "modules/mangrove-biomass-data/actions";

import Component from "./component";

const mapStateToProps = (state) => ({
  isLoading: state.mangroveBiomassData.isLoading,
  data: state.mangroveBiomassData.data,
  metadata: state.mangroveBiomassData.metadata,
  ui: state.widgets.ui.biomass,
  drawingValue: state.drawingTool.drawingValue,
  drawingMode: state.drawingTool.drawingMode,
});
const mapDispatchToProps = {
  setUi,
  fetchMangroveBiomassData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
