import { createAction } from 'vizzuality-redux-tools';

export const setDashboard = createAction('DASHBOARD/setDashboard');
export const setWidgets = createAction('DASHBOARD/setWidgets');
export const addWidget = createAction('DASHBOARD/addWidget');
export const removeWidget = createAction('DASHBOARD/removeWidget');
export const setActiveLayers = createAction('DASHBOARD/setActiveLayers');
export const addActiveLayer = createAction('DASHBOARD/addActiveLayer');
export const removeActiveLayer = createAction('DASHBOARD/removeActiveLayer');

export default {
  setDashboard,
  setWidgets,
  addWidget,
  removeWidget,
  setActiveLayers,
  addActiveLayer,
  removeActiveLayer
};
