import { createAction } from 'vizzuality-redux-tools';

export const setSearch = createAction('SEARCH/setSearch');
export const setSearchTerm = createAction('SEARCH/setSearchTerm');
export const setSearchResults = createAction('SEARCH/setSearchResults');

export default {
  setSearch,
  setSearchTerm,
  setSearchResults
};
