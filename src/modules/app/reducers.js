import { pageActions } from './actions';

const setHeader = (state, { payload }) => ({ ...state, header: key, payload });

const reducerMap = Object.keys(pageActions).reduce(
  (acc, key) => ({ ...acc, [key]: setPageReducer(key) }),
  {}
);

export default reducerMap;
