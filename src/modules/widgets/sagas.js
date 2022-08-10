import { all, takeLeading, takeLatest, put, call, select } from 'redux-saga/effects';
import DATA from 'config/data';
import { breakpoints } from 'utils/responsive';
import { toggleActive as toggleLayerActive, fetchLayers } from 'modules/layers/actions';
import { setCurrent } from 'modules/dashboards/actions';
import { fetchSucceeded, toggleActive, collapseAll } from './actions';

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms));
}

export function* getWidgets() {
  const isDesktop = window.matchMedia(`(min-width: ${breakpoints.md}px)`).matches;
  const { widgets } = DATA;

  if (isDesktop) {
    for (let i = 0; i < widgets.length; i++) {
      if (widgets[i].slug === 'mangrove_extent') {
        yield put(toggleLayerActive({
          id: 'extent',
          isActive: false
        }));
      }
    }
  }

  yield put(fetchSucceeded(widgets));
}

// Part of query state, not normal flow.
// View ./index.js queryState.add for more info.
export function* restoreWidgetsState() {
  /**
   * A regular selector, it could be on a selectors file with reselect
   * or better yet, be created automatically by the package based on registered namespace info.
  */
  function* handler() {
    const widgetsSelector = state => ({
      urlWidgets: (state.router.query && state.router.query.widgets) || null,
      stateWidgets: state.widgets.list
    });

    const { urlWidgets, stateWidgets } = yield select(widgetsSelector);

    if (urlWidgets) {
      const toDispatch = [];
      const updatedWidgets = stateWidgets.map((widget) => {
        const updatedWidget = Object.assign({}, widget);

        if (urlWidgets[widget.slug]) {
          const update = urlWidgets[widget.slug];
          const widgetLayers = updatedWidget.layersIds;

          if (update.isActive) {
            const widgetActions = [];

            // Activate the widget
            updatedWidget.isActive = true;
            widgetActions.push(put(toggleActive({
              isActive: true
            })));

            // Activate associated layers
            if (widgetLayers.length > 0) {
              const layersActions = widgetLayers.map(layerId => put(toggleLayerActive({
                id: layerId,
                isActive: true
              })));

              widgetActions.push(...layersActions);
            }

            toDispatch.push(all(widgetActions));
          }

          if (update.isCollapsed) {
            updatedWidget.isCollapsed = true;
          }
        }

        return updatedWidget;
      });

      yield put(fetchSucceeded(updatedWidgets));
      yield call(delay, 1500);
      yield all(toDispatch);
    }
  }

  yield takeLeading(fetchSucceeded().type, handler);
}

function* handleWidgetsMenu() {
  yield put(collapseAll());
}

export default function* widgetsSagas() {
  yield takeLatest(fetchLayers().type, getWidgets);
  yield takeLatest(setCurrent, handleWidgetsMenu);
}
