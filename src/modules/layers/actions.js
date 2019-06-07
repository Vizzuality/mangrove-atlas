import { createAction } from 'vizzuality-redux-tools';

export const setList = createAction('LAYERS/setList');
export const setLoading = createAction('LAYERS/setLoading');
export const setError = createAction('LAYERS/setError');
export const getLayers = createAction('LAYERS/getLayers');

export default {
  setList,
  setLoading,
  setError,
  getLayers
};
