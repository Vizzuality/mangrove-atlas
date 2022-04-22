import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from "redux-saga";
import { handleModule } from "vizzuality-redux-tools";

import * as app from "modules/app";
import * as pages from "modules/pages";
import * as map from "modules/map";
import * as mapStyles from "modules/map-styles";
import * as layers from "modules/layers";
import * as widgets from "modules/widgets";
import * as locations from "modules/locations";
import * as dashboards from "modules/dashboards";
import * as languages from "modules/languages";
import * as mangroveData from "modules/mangrove-data";
import * as mangroveProtectionData from "modules/mangrove-protection-data";
import * as investmentPotentialData from "modules/mangrove-investment-data";
import * as ranking from "modules/ranking";
import * as alerts from "modules/alerts";

import router from "./router";
import sagas from "./sagas";

const modules = [
  { namespace: "app", components: app },
  { namespace: "page", components: pages },
  { namespace: "map", components: map },
  { namespace: "layers", components: layers },
  { namespace: "widgets", components: widgets },
  { namespace: "locations", components: locations },
  { namespace: "dashboards", components: dashboards },
  { namespace: "mapStyles", components: mapStyles },
  { namespace: "languages", components: languages },
  { namespace: "mangroveData", components: mangroveData },
  { namespace: "mangroveProtectionData", components: mangroveProtectionData },
  { namespace: "investmentPotentialData", components: investmentPotentialData },
  { namespace: "ranking", components: ranking },
  { namespace: "alerts", components: alerts },
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
