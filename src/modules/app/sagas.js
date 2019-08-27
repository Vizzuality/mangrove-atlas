import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations } from 'modules/locations/actions';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';
import { fetchLanguages } from 'modules/languages/actions';
import { fetchMangroveData } from 'modules/mangrove-data/actions';
import { initializeApp } from './actions';

function* loadInitialData() {
  const {
    locations,
    dashboards,
    widgets,
    layers,
    mapStyles,
    languages,
    mangroveData
  } = yield select();
  if (!locations.list.length) yield put(fetchLocations());
  if (!dashboards.defaults.length) yield put(fetchDashboards());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (!layers.list.length) yield put(fetchLayers());
  if (!mapStyles.layers) yield put(fetchMapStyles());
  if (!languages.list.length) yield put(fetchLanguages());
  if (!mangroveData.list.length) yield put(fetchMangroveData());
}

export default function* app() {
  yield takeLatest(initializeApp().type, loadInitialData);
}
