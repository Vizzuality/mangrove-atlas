import { connect } from "react-redux";

import { closeSearchPanel } from "modules/locations/actions";

import Component from "./component";

const mapDispatchToProps = {
  closeSearchPanel,
};

export default connect(null, mapDispatchToProps)(Component);
