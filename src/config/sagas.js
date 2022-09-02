import { all, fork } from "redux-saga/effects";

import queryState from "utils/query-state";

import app from 'modules/app/sagas';
import pages from 'modules/pages/sagas';
import map from 'modules/map/sagas';
import mapStyles from 'modules/map-styles/sagas';
import layers from 'modules/layers/sagas';
import widgets from 'modules/widgets/sagas';
import locations from 'modules/locations/sagas';
import dashboards from 'modules/dashboards/sagas';
import languages from 'modules/languages/sagas';
import mangroveData from 'modules/mangrove-data/sagas';
import mangroveSpeciesData from 'modules/mangrove-species-data/sagas';
import mangroveBiomassData from 'modules/mangrove-biomass-data/sagas';
import mangroveHeightData from 'modules/mangrove-height-data/sagas';
import mangroveNetChangeData from 'modules/mangrove-net-change-data/sagas';
import mangroveHabitatExtentData from 'modules/mangrove-habitat-extent-data/sagas';
import ranking from 'modules/ranking/sagas';
import mangroveProtectionData from 'modules/mangrove-protection-data/sagas';
import mangroveRestorationData from 'modules/mangrove-restoration-data/sagas';
import mangroveDegradationAndLossData from 'modules/mangrove-degradation-and-loss-data/sagas';
import alerts from 'modules/alerts/sagas';
import mangroveInvestmentPotential from "modules/mangrove-investment-data/sagas";
import mangroveEcosystemServicesData from "modules/mangrove-ecosystem-services-data/sagas";
import mangroveInternationalStatusData from "modules/mangrove-international-status-data/sagas";
import mangroveEmissionsMitigationData from "modules/mangrove-emissions-mitigation-data/sagas";
import restorationSites from 'modules/restorationSites/restorationSitesSagas';

export default function* root() {
  yield all([
    fork(queryState.sagas.bind(queryState)),
    fork(app),
    fork(pages),
    fork(map),
    fork(mapStyles),
    fork(layers),
    fork(widgets),
    fork(locations),
    fork(dashboards),
    fork(languages),
    fork(mangroveData),
    fork(mangroveSpeciesData),
    fork(mangroveBiomassData),
    fork(mangroveHeightData),
    fork(mangroveNetChangeData),
    fork(mangroveHabitatExtentData),
    fork(ranking),
    fork(mangroveProtectionData),
    fork(mangroveInvestmentPotential),
    fork(alerts),
    fork(mangroveRestorationData),
    fork(mangroveDegradationAndLossData),
    fork(mangroveEcosystemServicesData),
    fork(mangroveInternationalStatusData),
    fork(mangroveEmissionsMitigationData),
    fork(alerts),
    fork(restorationSites),
  ]);
}
