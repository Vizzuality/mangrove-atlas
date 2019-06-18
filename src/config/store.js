import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { handleModule } from 'vizzuality-redux-tools';
import { all, fork } from 'redux-saga/effects';

import { PAGES } from 'modules/pages/constants';

import * as app from 'modules/app';
import * as pages from 'modules/pages';
import * as map from 'modules/map';
import * as search from 'modules/search';
import * as layers from 'modules/layers';
import * as widgets from 'modules/widgets';
import * as locations from 'modules/locations';
import * as dashboards from 'modules/dashboards';
// Not actually a module, more like middleware
import { queryState } from 'modules/query-state';

import router from './router';

queryState.config({
  routerActions: PAGES.map(p => p.name)
});

const modules = [
  { namespace: 'app', components: app },
  { namespace: 'page', components: pages },
  { namespace: 'map', components: map },
  { namespace: 'search', components: search },
  { namespace: 'layers', components: layers },
  { namespace: 'widgets', components: widgets },
  { namespace: 'locations', components: locations },
  { namespace: 'dashboards', components: dashboards }
];

const {
  initialDispatch,
  reducer: routerReducer,
  middleware: routerMiddleware,
  enhancer: routerEnhancer
} = router;

const {
  middleware: queryStateMiddleware
} = queryState;

const sagaMiddleware = createSagaMiddleware();

const reducers = combineReducers({
  router: routerReducer,
  ...modules.reduce(
    (acc, module) => ({ ...acc, [module.namespace]: handleModule(module.components) }),
    {}
  )
});

const middleware = applyMiddleware(
  routerMiddleware,
  sagaMiddleware,
  // queryStateMiddleware
);

const enhancers = composeWithDevTools(routerEnhancer, middleware);

const store = createStore(reducers, enhancers);

// todo: add a register for this
sagaMiddleware.run(function* root() {
  yield all([
    fork(app.sagas),
    fork(pages.sagas),
    // fork(map.sagas),
    fork(layers.sagas),
    fork(widgets.sagas),
    fork(layers.sagas),
    fork(locations.sagas),
    fork(dashboards.sagas)
  ]);
});
initialDispatch();

export default store;
