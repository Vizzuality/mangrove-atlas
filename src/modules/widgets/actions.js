import { createAction } from 'vizzuality-redux-tools';

export const setList = createAction('WIDGETS/setList');
export const setLoading = createAction('WIDGETS/setLoading');
export const setError = createAction('WIDGETS/setError');

export default {
  setList,
  setLoading,
  setError
};
