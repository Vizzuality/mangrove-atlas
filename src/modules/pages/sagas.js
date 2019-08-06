import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations, closeSearchPanel, setCurrent } from 'modules/locations/actions';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';
import { fetchLanguages } from 'modules/languages/actions';

function* loadInitialData({ payload }) {
  const { locations, dashboards, widgets, layers, mapStyles } = yield select();
  if (!locations.list.length) yield put(fetchLocations());
  if (!dashboards.list.length) yield put(fetchDashboards());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (!layers.list.length) yield put(fetchLayers());
  if (!mapStyles.layers) yield put(fetchMapStyles());
  if (!locations.list.length) yield put(fetchLanguages());
  yield put(closeSearchPanel());

  /**
   * Set current location
   */
  if (payload.id || payload.iso) {
    yield put(setCurrent({ ...payload }));
  } else {
    yield put(setCurrent({ id: 'global' }));
  }
}

export default function* pages() {
  yield takeLatest('PAGE/APP', loadInitialData);
  yield takeLatest('PAGE/COUNTRY', loadInitialData);
  yield takeLatest('PAGE/AOI', loadInitialData);
  yield takeLatest('PAGE/WDPA', loadInitialData);
}
