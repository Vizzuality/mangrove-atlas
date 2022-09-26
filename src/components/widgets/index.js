import { connect } from "react-redux";

import { addFilter, removeFilter } from "modules/map-styles/actions";
import { expandAll, collapseAll } from "modules/widgets/actions";
import { dashboardWidgets, getWidgetsWithData } from "modules/widgets/selectors";
import { currentLocation } from "modules/locations/selectors";

import HighlightedPlaces from 'widget-components/highlighted-places';
import MangroveCoverage from 'widget-components/mangrove-coverage';
import MangroveExtent from 'widget-components/mangrove-extent';
import MangroveNetChange from 'widget-components/mangrove-net-change';
import MangroveBlueCarbon from 'widget-components/mangrove-blue-carbon';
import MangroveProtection from 'widget-components/mangrove-protection';
import MangroveSpecies from 'widget-components/mangrove-species';
import MangroveRestoration from 'widget-components/mangrove-restoration';
import MangroveActivity from 'widget-components/mangrove-activity';
import RestorationSites from 'widget-components/restoration-sites';
import MangroveAlerts from 'widget-components/mangrove-alerts';
import MangroveHeight from 'widget-components/mangrove-height';
import MangroveBiomass from 'widget-components/mangrove-biomass';
import ConservationHotspots from 'widget-components/conservation-hotspots';
import MangroveInvestmentPotential from "widget-components/mangrove-investment-potential";
import MangroveInternationalStatus from "widget-components/mangrove-international-status";
import MangroveEmissionsMitigation from "widget-components/mangrove-emissions-mitigation";

import Component from "./component";

export const templates = new Map([
  ['highlighted-places', {
    component: HighlightedPlaces
  }],
  ['mangrove_coverage', {
    component: MangroveCoverage
  }],
  ['mangrove_extent', {
    component: MangroveExtent,
  }],
  ['mangrove_net_change', {
    component: MangroveNetChange
  }],
  ['mangrove_blue_carbon', {
    component: MangroveBlueCarbon
  }],
  ['mangrove_protection', {
    component: MangroveProtection
  }],
  ['mangrove_species', {
    component: MangroveSpecies
  }],
  ['mangrove_restoration', {
    component: MangroveRestoration
  }],
  ['mangrove_activity', {
    component: MangroveActivity
  }],
  ['highlighted_places', {
    component: HighlightedPlaces
  }],
  ['restoration_sites', {
    component: RestorationSites
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
  }],
  [
    "mangrove_investment_potential",
    {
      component: MangroveInvestmentPotential,
    },
  ],
  [
    "mangrove_international_status",
    {
      component: MangroveInternationalStatus,
    },
  ],
  [
    "mangrove_emissions_mitigation",
    {
      component: MangroveEmissionsMitigation,
    },
  ],
]);

const mapStateToProps = (state) => ({
  currentLocation: currentLocation(state),
  widgets: dashboardWidgets(state),
  templates,
  isCollapsed: state.widgets.isCollapsed,
  category: state.dashboards.current,
  dataByWidget: getWidgetsWithData(state)
});

const mapDispatchToProps = {
  expandAll,
  collapseAll,
  addFilter,
  removeFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
