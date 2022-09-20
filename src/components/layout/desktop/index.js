import { connect } from "react-redux";

import Component from './component';

import {
  dashboardWidgets,
  getWidgetsWithData,
} from "modules/widgets/selectors";

const mapStateToProps = (state) => ({
  widgets: dashboardWidgets(state),
  category: state.dashboards.current,
  dataByWidget: getWidgetsWithData(state),
});

export default connect(mapStateToProps)(Component);
