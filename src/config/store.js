import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { handleModule } from 'vizzuality-redux-tools';

import { PAGES } from 'modules/pages/constants';
import * as app from 'modules/app';
import * as pages from 'modules/pages';
import * as map from 'modules/map';
import { queryState } from 'modules/query-state';
import router from './router';

queryState.config({
  routerActions: PAGES.map(p => p.name)
});

const modules = [
  { namespace: 'app', components: app },
  { namespace: 'page', components: pages },
  { namespace: 'map', components: map }
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

const reducers = combineReducers({
  router: routerReducer,
  ...modules.reduce(
    (acc, module) => ({ ...acc, [module.namespace]: handleModule(module.components) }),
    {}
  )
});

const middleware = applyMiddleware(
  routerMiddleware,
  queryStateMiddleware
);

const enhancers = composeWithDevTools(routerEnhancer, middleware);

const store = createStore(reducers, enhancers);

initialDispatch();

export default store;
