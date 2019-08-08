import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations, closeSearchPanel, setCurrent } from 'modules/locations/actions';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';
import { fetchLanguages } from 'modules/languages/actions';
import { fetchMangroveData } from 'modules/mangrove-data/actions';

function* loadInitialData({ payload }) {
  const {
    locations, dashboards, widgets, layers,
    mapStyles, languages, mangroveData
  } = yield select();
  if (!locations.list.length) yield put(fetchLocations());
  if (!dashboards.defaults.length) yield put(fetchDashboards());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (!layers.list.length) yield put(fetchLayers());
  if (!mapStyles.layers) yield put(fetchMapStyles());
  if (!languages.list.length) yield put(fetchLanguages());
  if (!mangroveData.list.length) yield put(fetchMangroveData());
  yield put(closeSearchPanel());

  /**
   * Set current location
   */
  if (payload.id || payload.iso) {
    yield put(setCurrent({ ...payload }));
  } else {
    yield put(setCurrent({ id: 'worldwide' }));
  }
}

export default function* pages() {
  yield takeLatest('PAGE/APP', loadInitialData);
  yield takeLatest('PAGE/COUNTRY', loadInitialData);
  yield takeLatest('PAGE/AOI', loadInitialData);
  yield takeLatest('PAGE/WDPA', loadInitialData);
}
