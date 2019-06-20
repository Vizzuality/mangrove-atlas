import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations } from 'modules/locations/actions';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';

function* loadInitialData() {
  const { locations, dashboards, widgets, layers } = yield select();
  if (!locations.list.length) yield put(fetchLocations());
  if (!dashboards.list.length) yield put(fetchDashboards());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (!layers.list.length) yield put(fetchLayers());
  yield put(fetchMapStyles());
}

export default function* pages() {
  yield takeLatest('APP', loadInitialData);
}
