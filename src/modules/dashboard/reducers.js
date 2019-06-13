import * as actions from './actions';

const {
  setDashboard,
  setLocation,
  setWidgets,
  addWidget,
  removeWidget,
  setActiveLayers,
  addActiveLayer,
  removeActiveLayer,
  setWidgetCollapsed,
  toggleWidgetLayers
} = actions;

function removeById(arr, id) {
  return arr.filter(item => item.id !== id);
}

export default {
  [setDashboard]: (state, { payload }) => ({ ...state, ...payload }),
  [setLocation]: (state, { payload }) => ({ ...state, location: payload }),
  [setWidgets]: (state, { payload }) => ({ ...state, widgets: payload }),
  [addWidget]: (state, { payload }) => ({ ...state, widgets: [...state.widgets, payload] }),
  [removeWidget]: (state, { payload }) => ({
    ...state,
    widgets: removeById(state.widgets, payload)
  }),
  [setActiveLayers]: (state, { payload }) => ({ ...state, activeLayers: payload }),
  [addActiveLayer]: (state, { payload }) => ({
    ...state,
    activeLayers: [...state.activeLayers, payload]
  }),
  [removeActiveLayer]: (state, { payload }) => ({
    ...state,
    activeLayers: removeById(state.activeLayers, payload)
  }),
  [setWidgetCollapsed]: (state, { payload: { id, isCollapsed } }) => ({
    ...state,
    widgets: state.widgets.map(widget => ((widget.id !== id)
      ? widget
      : { ...widget, isCollapsed }))
  }),
  [toggleWidgetLayers]: (state, { payload: { id } }) => ({
    ...state,
    widgets: state.widgets.map(widget => ((widget.id !== id)
      ? widget
      : { ...widget, isDisplayedOnMap: !widget.isDisplayedOnMap }))
  })
};
