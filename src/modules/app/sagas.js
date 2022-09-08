import { takeLatest, put, select } from 'redux-saga/effects';

import { fetchDashboards } from 'modules/dashboards/actions';
import { fetchLanguages } from 'modules/languages/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchLocations } from 'modules/locations/actions';
import { fetchMangroveData } from 'modules/mangrove-data/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';
import { fetchRankingData } from 'modules/ranking/actions';
import { fetchRestorationSites } from 'modules/restorationSites/restorationSitesActions';
import { fetchWidgets } from 'modules/widgets/actions';
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
    restorationSites,
  } = yield select();

  if (!locations.list.length) yield put(fetchLocations());
  if (!dashboards.list.length) yield put(fetchDashboards());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (!layers.list.length) yield put(fetchLayers());
  if (!mapStyles.layers) yield put(fetchMapStyles());
  if (!languages.list.length) yield put(fetchLanguages());
  if (!mangroveData.list.length) yield put(fetchMangroveData());
  if (!ranking.data.length) yield put(fetchRankingData());
  if (!restorationSites.data.length) yield put(fetchRestorationSites());
}

export default function* app() {
  yield takeLatest(initializeApp().type, loadInitialData);
}
