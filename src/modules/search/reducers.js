import * as actions from './actions';

const {
  setSearch,
  setSearchTerm,
  setSearchResults
} = actions;

export default {
  [setSearch]: (state, { payload }) => ({ ...state, ...payload }),
  [setSearchTerm]: (state, { payload }) => ({ ...state, term: payload }),
  [setSearchResults]: (state, { payload }) => ({ ...state, results: payload })
};
