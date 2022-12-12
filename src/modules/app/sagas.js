import { takeLatest, put, select } from 'redux-saga/effects';
import { fetchLocations } from 'modules/locations/actions';
import { fetchDashboards, setCurrent } from 'modules/dashboards/actions';
import { fetchWidgets, toggleActiveById } from 'modules/widgets/actions';
import { fetchLayers } from 'modules/layers/actions';
import { fetchMapStyles } from 'modules/map-styles/actions';
import { fetchLanguages } from 'modules/languages/actions';

import { initializeApp } from './actions';
import { fetchRestorationSites } from 'modules/restorationSites/restorationSitesActions';

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
  } = yield select();

  const { current } = dashboards;
  if (router?.prev?.query?.category) {
    yield put(setCurrent(router?.prev?.query?.category))
  } else {
    yield put(setCurrent(current))
  };

  // if (router?.prev?.query?.activeLayers) {
  //   console.log('ACTIVE LAYERS', router?.prev?.query?.activeLayers);
  //   yield put(toggleActiveById({ id: 'mangrove_net_change', isActive: true }))
  //   yield put(router?.prev?.query?.activeLayers?.split(',')?.map(slug => toggleActiveById({ id: slug, isActive: true })))
  // };

  // Accion que setea las layers que esta en los widgets con las activeLayers
  if (!locations.list.length) yield put(fetchLocations());
  if (!dashboards.list.length) yield put(fetchDashboards());
  if (!widgets.list.length) yield put(fetchWidgets());
  if (!layers.list.length) yield put(fetchLayers());
  if (!mapStyles.layers) yield put(fetchMapStyles());
  if (!languages.list.length) yield put(fetchLanguages());
  if (!restorationSites.data.length) yield put(fetchRestorationSites());
}

export default function* app() {
  yield takeLatest(initializeApp().type, loadInitialData);
}
