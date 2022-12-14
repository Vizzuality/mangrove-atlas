import { createAction } from 'vizzuality-redux-tools';

export const setMobileView = createAction('APP/MOBILE');
export const initializeApp = createAction('APP/INITIALIZE_APP');
export const setPrintMode = createAction('APP/SET_PRINT_MODE');
export const setPrintingMode = createAction('APP/SET_PRINTING_MODE');

export default {
  setMobileView,
  initializeApp,
  setPrintMode,
  setPrintingMode,
};
