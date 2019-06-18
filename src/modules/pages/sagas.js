import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations } from 'modules/locations/actions';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';

function* loadInitialData() {
  const { locations, dashboards, widgets, layers } = yield select();
  if (locations.list.length === 0) yield put(fetchLocations());
  if (dashboards.list.length === 0) yield put(fetchDashboards());
  if (widgets.list.length === 0) yield put(fetchWidgets());
  if (layers.list.length === 0) yield put(fetchLayers());
}

export default function* pages() {
  yield takeLatest('APP', loadInitialData);
}
