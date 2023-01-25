import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations } from 'modules/locations/actions';
import { fetchDashboards, setCurrent } from 'modules/dashboards/actions';
import { fetchWidgets, setActiveLayers } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';
import { fetchLanguages } from 'modules/languages/actions';

import { fetchRestorationSites } from 'modules/restorationSites/restorationSitesActions';
import { setViewport } from 'modules/map/actions';
import { initializeApp, setInitial } from './actions';

function* loadInitialData() {
  const {
    locations,
    dashboards,
    widgets,
    layers,
    mapStyles,
    languages,
    restorationSites,
    router,
    map,
  } = yield select();

  const { current } = dashboards;
  if (!dashboards.list.length) yield put(fetchDashboards());
  if (router?.prev?.query?.category) {
    yield put(setCurrent(router?.prev?.query?.category));
  } else {
    yield put(setCurrent(current));
  }

  if (!layers.list.length) yield put(fetchLayers());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (router?.prev?.query?.activeLayers) {
    yield put(setActiveLayers(router?.prev?.query?.activeLayers));
  }

  if (!locations.list.length) yield put(fetchLocations());
  if (!mapStyles.layers) yield put(fetchMapStyles());
  if (!languages.list.length) yield put(fetchLanguages());
  if (!restorationSites.data.length) yield put(fetchRestorationSites());
  if (!!router?.prev?.query?.zoom && Number(router?.prev?.query?.zoom !== 2)) {
    yield put(setViewport({
      width: '100%',
      height: '100%',
      minZoom: Number(router?.prev?.query?.zoom),
      maxZoom: 30,
      latitude: 20,
      longitude: 0,
    }));
  }
  yield put(setInitial(true));
}

export default function* app() {
  yield takeLatest(initializeApp().type, loadInitialData);
}
