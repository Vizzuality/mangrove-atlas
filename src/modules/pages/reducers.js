import { pageActions } from './actions';

const setPageReducer = key => (state, action) => ({...state, current: key});
const reducerMap = Object.keys(pageActions).reduce(
  (acc, key) => ({ ...acc, [key]: setPageReducer(key)})
  , {}
);

export default reducerMap;
