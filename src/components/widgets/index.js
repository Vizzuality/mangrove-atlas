import { connect } from 'react-redux';

import { addFilter, removeFilter } from 'modules/map-styles/actions';
import { expandAll, collapseAll } from 'modules/widgets/actions';
import { dashboardWidgets } from 'modules/widgets/selectors';
import { currentLocation } from 'modules/locations/selectors';

import HighlightedPlaces from 'widget-components/highlighted-places';
import MangroveCoverage from 'widget-components/mangrove-coverage';
import MangroveExtent from 'widget-components/mangrove-extent';
import MangroveNetChange from 'widget-components/mangrove-net-change';
import MangroveBlueCarbon from 'widget-components/mangrove-blue-carbon';
import MangroveSpecies from 'widget-components/mangrove-species';
import MangroveActivity from 'widget-components/mangrove-activity';
import MangroveAlerts from 'widget-components/mangrove-alerts';
import MangroveHeight from 'widget-components/mangrove-height';
import MangroveBiomass from 'widget-components/mangrove-biomass';
import ConservationHotspots from 'widget-components/conservation-hotspots';

import Component from './component';

export const templates = new Map([
  ['highlighted-places', {
    component: HighlightedPlaces
  }],
  ['mangrove_coverage', {
    component: MangroveCoverage
  }],
  ['mangrove_extent', {
    component: MangroveExtent
  }],
  ['mangrove_net_change', {
    component: MangroveNetChange
  }],
  ['mangrove_blue_carbon', {
    component: MangroveBlueCarbon
  }],
  ['mangrove_species', {
    component: MangroveSpecies
  }],
  ['mangrove_activity', {
    component: MangroveActivity
  }],
  ['highlighted_places', {
    component: HighlightedPlaces
  }],
  ['mangrove_alerts', {
    component: MangroveAlerts
  }],
  ['mangrove_height', {
    component: MangroveHeight
  }],
  ['mangrove_biomass', {
    component: MangroveBiomass
  }],
  ['conservation_hotspots', {
    component: ConservationHotspots
  }]
]);

const mapStateToProps = state => ({
  currentLocation: currentLocation(state),
  widgets: dashboardWidgets(state),
  templates,
  isCollapsed: state.widgets.isCollapsed
});

const mapDispatchToProps = {
  expandAll,
  collapseAll,
  addFilter,
  removeFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
