import { pageActions } from './actions';

const setPageReducer = key => state => ({ ...state, current: key });
const reducerMap = Object.keys(pageActions).reduce(
  (acc, key) => ({ ...acc, [key]: setPageReducer(key) }),
  {}
);

export default reducerMap;
