import { all, takeLeading, takeLatest, put, call, select } from 'redux-saga/effects';
import DATA from 'config/data.json';
import { breakpoints } from 'utils/responsive';
import { toggleActive as toggleLayerActive } from 'modules/layers/actions';
import { fetchSucceeded, toggleActive } from './actions';

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms));
}

export function* getWidgets() {
  const isDesktop = window.matchMedia(`(min-width: ${breakpoints.md}px)`).matches;
  const { widgets } = DATA;

  if (isDesktop) {
    for (let i = 0; i < widgets.length; i++) {
      if (widgets[i].slug === 'mangrove_coverage') {
        yield put(toggleLayerActive({
          id: 'coverage-1996-2016',
          isActive: true
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
  yield takeLatest('LAYERS/FETCH_ALL', getWidgets);
}
