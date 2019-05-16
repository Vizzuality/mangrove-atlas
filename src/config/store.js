import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { handleModule } from 'vizzuality-redux-tools';

import * as pages from 'modules/pages';
import * as map from 'modules/map';
import router from './router';

const modules = [
  { namespace: 'page', components: pages },
  { namespace: 'map', components: map }
];

const {
  initialDispatch,
  reducer: routerReducer,
  middleware: routerMiddleware,
  enhancer: routerEnhancer
} = router;

const reducers = combineReducers({
  router: routerReducer,
  ...modules.reduce((acc, module) => ({...acc, [module.namespace]: handleModule(module.components)}), {})
});

const middleware = applyMiddleware(
  routerMiddleware
);

const enhancers = composeWithDevTools(routerEnhancer, middleware);

const store = createStore(reducers, enhancers);

initialDispatch();

export default store;
