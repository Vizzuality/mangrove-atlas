import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';
import sagas, { restoreMapState } from './sagas';

import queryState from 'utils/query-state';

/** 
 * queryState.add register the namespace for url to state actions.
 * The name property will become the query param.
 * It is suppossed to be semantic:
 * 
 * For namespace 'map'
 * encode selector
 * after any of these actions are triggered.
 * 
 * For namespace 'map'
 * decode trigger
 * after all of these actions have happened.
*/
queryState.add({
  name: 'map',
  encode: {
    after: [
      actions.setBasemap,
    ],
    selector: state => ({ basemap: state.map.basemap })
  },
  decode: {
    trigger: restoreMapState
  }
});

export { actions, initialState, reducers, sagas };
