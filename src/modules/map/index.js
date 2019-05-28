import { queryState } from 'modules/query-state';

import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

// Both maps are relative to namespace
queryState.registry.add('map', {
  actions: [actions.setMapViewport],
  // input: appState, output: queryState
  encodeMap: state => ({
    ...state.viewport
  }),
  decodeMap: urlState => ({
    viewport: { ...urlState }
  })
});

export { actions, initialState, reducers };
