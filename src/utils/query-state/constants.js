import { createAction } from 'vizzuality-redux-tools';

export const ACTIONS = {
  STORE_STATE: createAction('__QUERY_STATE/STORE_STATE'),
  RESTORE_STATE: createAction('__QUERY_STATE/RESTORE_STATE')
};

export default ACTIONS;
