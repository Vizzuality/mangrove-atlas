import { connect } from "react-redux";
import { setUi } from "modules/widgets/actions";
import { fetchInvestmentPotentialData } from "modules/mangrove-investment-data/actions";

import Component from "./component";

const mapStateToProps = (state) => ({
  metadata: state.investmentPotentialData.metadata,
  data: state.investmentPotentialData.data,
  ui: state.widgets.ui.blue_carbon,
});

const mapDispatchToProps = {
  setUi,
  fetchInvestmentPotentialData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
