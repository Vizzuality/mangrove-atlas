import { connect } from 'react-redux';

import { addFilter, removeFilter } from 'modules/map-styles/actions';
import { expandAll, collapseAll } from 'modules/widgets/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';
import { currentLocation } from 'modules/locations/selectors';

import HighlightedPlaces from 'widget-components/highlighted-places';
import MangroveCoverage from 'widget-components/mangrove-coverage';
import MangroveNetChange from 'widget-components/mangrove-net-change';
import MangroveActivity from 'widget-components/mangrove-activity';
import MangroveAlerts from 'widget-components/mangrove-alerts';
import MangroveHeight from 'widget-components/mangrove-height';
import MangroveBiomass from 'widget-components/mangrove-biomass';

import Component from './component';

const templates = new Map([
  ['mangrove_coverage', {
    component: MangroveCoverage,
    data: null
  }],
  ['mangrove_net_change', {
    component: MangroveNetChange,
    data: null
  }],
  ['mangrove_activity', {
    component: MangroveActivity,
    data: null
  }],
  ['highlighted_places', {
    component: HighlightedPlaces,
    data: null
  }],
  ['mangrove_alerts', {
    component: MangroveAlerts,
    data: null
  }],
  ['mangrove_height', {
    component: MangroveHeight,
    data: null
  }],
  ['mangrove_biomass', {
    component: MangroveBiomass,
    data: null
  }]
]);

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  widgets: dashboardWidgets(state),
  templates
});

const mapDispatchToProps = {
  expandAll,
  collapseAll,
  addFilter,
  removeFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
