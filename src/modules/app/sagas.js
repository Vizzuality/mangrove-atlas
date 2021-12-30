import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations } from 'modules/locations/actions';
import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchWidgets } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';
import { fetchLanguages } from 'modules/languages/actions';
import { fetchMangroveData } from 'modules/mangrove-data/actions';
import { fetchRankingData } from 'modules/ranking/actions';
import { fetchMangroveProtectionData } from 'modules/mangrove-protection-data/actions';
import { initializeApp } from './actions';

function* loadInitialData() {
  const {
    locations,
    dashboards,
    widgets,
    layers,
    mapStyles,
    languages,
    mangroveData,
    ranking,
    mangroveProtectionData
  } = yield select();

  if (!locations.list.length) yield put(fetchLocations());
  if (!dashboards.list.length) yield put(fetchDashboards());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (!layers.list.length) yield put(fetchLayers());
  if (!mapStyles.layers) yield put(fetchMapStyles());
  if (!languages.list.length) yield put(fetchLanguages());
  if (!mangroveData.list.length) yield put(fetchMangroveData());
  if (!ranking.data.length) yield put(fetchRankingData());
  if (!mangroveProtectionData.data) yield put(fetchMangroveProtectionData());
}

export default function* app() {
  yield takeLatest(initializeApp().type, loadInitialData);
}
