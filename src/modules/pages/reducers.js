import { pageActions, setHeader } from './actions';

const setPageReducer = key => (state, { payload }) => ({ ...state, current: key, payload });

const reducerMap = Object.keys(pageActions).reduce(
  (acc, key) => ({ ...acc, [key]: setPageReducer(key) }),
  {}
);

export default reducerMap;
