// import { queryState, mask } from 'modules/query-state';

import * as actions from './actions';
import * as reducers from './reducers';
import sagas from './sagas';
import initialState from './initial-state';

// // Both maps are relative to namespace
// queryState.registry.add('map', {
//   actions: [actions.setViewport],
//   // input: appState, output: queryState
//   encodeMap: state => ({
//     ...mask(state.viewport, [
//       'zoom',
//       'latitude',
//       'longitude',
//       'bearing',
//       'pitch',
//       'altitude'
//     ])
//   }),
//   decodeMap: urlState => ({
//     viewport: { ...urlState }
//   })
// });

export { actions, initialState, reducers, sagas };
