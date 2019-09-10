import { all, takeLeading, takeLatest, put, call, select } from 'redux-saga/effects';
import DATA from 'config/data.json';
import { fetchSucceeded, toggleActive } from './actions';

import { breakpoints } from 'utils/responsive';

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

export function* getWidgets() {
  const isDesktop = window.matchMedia(`(min-width: ${breakpoints.md}px)`).matches;
  const { widgets } = DATA;

  if (isDesktop) {
    widgets.forEach(layer => {
      if (layer.slug === 'mangrove_coverage') {
        layer.isActive = true;
     }
    });
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
      const updatedWidgets = stateWidgets.map(widget => {
        const updatedWidget = Object.assign({}, widget);

        if (urlWidgets[widget.slug]) {
          const update = urlWidgets[widget.slug];

          if (update.isActive) {
            updatedWidget.isActive = true;
            toDispatch.push(put(toggleActive({
              isActive: true
            })));
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

export default function* widgetsSagas() {
  yield takeLatest('WIDGETS/FETCH_ALL', getWidgets);
}
