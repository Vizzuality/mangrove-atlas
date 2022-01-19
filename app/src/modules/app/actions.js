import { createAction } from 'vizzuality-redux-tools';

export const setMobileView = createAction('APP/MOBILE');
export const initializeApp = createAction('APP/INITIALIZE_APP');

export default {
  setMobileView,
  initializeApp
};
