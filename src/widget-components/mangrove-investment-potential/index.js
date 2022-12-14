import { connect } from "react-redux";
import { fetchInvestmentPotentialData } from "modules/mangrove-investment-data/actions";

import Component from "./component";

const mapStateToProps = (state) => ({
  metadata: state.mangroveInvestmentPotentialData.metadata,
  data: state.mangroveInvestmentPotentialData.data,
  ui: state.widgets.ui.investment_potential,
});

const mapDispatchToProps = {
  fetchInvestmentPotentialData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
