import { createAction } from 'vizzuality-redux-tools';

export const setMobileView = createAction('APP/MOBILE');
export const initializeApp = createAction('APP/INITIALIZE_APP');
export const setInitial = createAction('APP/SET_INITIAL');
export const setPrintMode = createAction('APP/SET_PRINT_MODE');
export const setPrintingMode = createAction('APP/SET_PRINTING_MODE');

export default {
  setMobileView,
  setInitial,
  initializeApp,
  setPrintMode,
  setPrintingMode,
};