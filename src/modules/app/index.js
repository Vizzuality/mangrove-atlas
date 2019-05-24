import { queryState } from 'modules/query-state';

import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

// Both maps are relative to namespace
queryState.registry.add('app', {
  actions: Object.keys(actions).map(key => actions[key]),
  encodeMap: state => ({
    ...state
  }),
  decodeMap: urlState => ({
    ...urlState
  })
});

export { actions, initialState, reducers };
