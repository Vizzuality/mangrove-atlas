import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import { handleModule } from 'vizzuality-redux-tools';

import * as app from 'modules/app';
import * as pages from 'modules/pages';
import * as map from 'modules/map';
import * as mapStyles from 'modules/map-styles';
import * as layers from 'modules/layers';
import * as widgets from 'modules/widgets';
import * as locations from 'modules/locations';
import * as dashboards from 'modules/dashboards';
import * as languages from 'modules/languages';
import * as drawingTool from 'modules/drawing-tool';
import * as mangroveNetChangeData from 'modules/mangrove-net-change-data';
import * as mangroveBlueCarbonData from 'modules/mangrove-blue-carbon-data';
import * as mangroveHabitatExtentData from 'modules/mangrove-habitat-extent-data';
import * as mangroveProtectionData from 'modules/mangrove-protection-data';
import * as mangroveSpeciesData from 'modules/mangrove-species-data';
import * as mangroveInvestmentPotentialData from 'modules/mangrove-investment-data';
import * as mangroveActivityData from 'modules/mangrove-activity-data';
import * as mangroveRestorationData from 'modules/mangrove-restoration-data';
import * as mangroveBiomassData from 'modules/mangrove-biomass-data';
import * as mangroveHeightData from 'modules/mangrove-height-data';
import * as mangroveDegradationAndLossData from 'modules/mangrove-degradation-and-loss-data';
import * as mangroveEcosystemServicesData from 'modules/mangrove-ecosystem-services-data';
import * as mangroveInternationalStatusData from 'modules/mangrove-international-status-data';
import * as mangroveEmissionsMitigationData from 'modules/mangrove-emissions-mitigation-data';
import * as ranking from 'modules/ranking';
import * as alerts from 'modules/alerts';
import * as restorationSites from 'modules/restorationSites';

import router from './router';
import sagas from './sagas';

const modules = [
  { namespace: 'app', components: app },
  { namespace: 'page', components: pages },
  { namespace: 'map', components: map },
  { namespace: 'layers', components: layers },
  { namespace: 'widgets', components: widgets },
  { namespace: 'locations', components: locations },
  { namespace: 'dashboards', components: dashboards },
  { namespace: 'mapStyles', components: mapStyles },
  { namespace: 'languages', components: languages },
  { namespace: 'drawingTool', components: drawingTool },
  { namespace: 'mangroveNetChangeData', components: mangroveNetChangeData },
  { namespace: 'mangroveActivityData', components: mangroveActivityData },
  { namespace: 'mangroveBlueCarbonData', components: mangroveBlueCarbonData },
  { namespace: 'mangroveHabitatExtentData', components: mangroveHabitatExtentData },
  { namespace: 'mangroveProtectionData', components: mangroveProtectionData },
  { namespace: 'mangroveSpeciesData', components: mangroveSpeciesData },
  { namespace: 'mangroveInvestmentPotentialData', components: mangroveInvestmentPotentialData },
  { namespace: 'mangroveRestorationData', components: mangroveRestorationData },
  { namespace: 'mangroveBiomassData', components: mangroveBiomassData },
  { namespace: 'mangroveHeightData', components: mangroveHeightData },
  { namespace: 'mangroveDegradationAndLossData', components: mangroveDegradationAndLossData },
  { namespace: 'mangroveEcosystemServicesData', components: mangroveEcosystemServicesData },
  { namespace: 'mangroveEmissionsMitigationData', components: mangroveEmissionsMitigationData },
  { namespace: 'mangroveInternationalStatusData', components: mangroveInternationalStatusData },
  { namespace: 'ranking', components: ranking },
  { namespace: 'alerts', components: alerts },
  { namespace: 'restorationSites', components: restorationSites },
];

const {
  initialDispatch,
  reducer: routerReducer,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
} = router;

const sagaMiddleware = createSagaMiddleware();

const reducers = combineReducers({
  router: routerReducer,
  ...modules.reduce(
    (acc, module) => ({
      ...acc,
      [module.namespace]: handleModule(module.components),
    }),
    {}
  ),
});

const middleware = applyMiddleware(routerMiddleware, sagaMiddleware);
const enhancers = composeWithDevTools(routerEnhancer, middleware);
const store = createStore(reducers, enhancers);

sagaMiddleware.run(sagas);
initialDispatch();

export default store;
