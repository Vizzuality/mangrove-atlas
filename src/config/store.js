import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { handleModule } from 'vizzuality-redux-tools';

import * as pages from 'modules/pages';

const reducers = combineReducers({
  page: handleModule(pages)
});

const store = createStore(reducers, devToolsEnhancer());

export default store;
