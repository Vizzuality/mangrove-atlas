import { all, fork } from 'redux-saga/effects';

import queryState from 'utils/query-state';

import pagesSagas from 'modules/pages/sagas';
import mapSagas from 'modules/map/sagas';
import mapStylesSagas from 'modules/map-styles/sagas';
import layersSagas from 'modules/layers/sagas';
import widgetsSagas from 'modules/widgets/sagas';
import locationsSagas from 'modules/locations/sagas';
import dashboardsSagas from 'modules/dashboards/sagas';
import languagesSagas from 'modules/languages/sagas';
import mangroveDataSagas from 'modules/mangrove-data/sagas';

export default function* root() {
  yield all([
    fork(queryState.sagas.bind(queryState)),
    fork(pagesSagas),
    fork(mapSagas),
    fork(mapStylesSagas),
    fork(layersSagas),
    fork(widgetsSagas),
    fork(locationsSagas),
    fork(dashboardsSagas),
    fork(languagesSagas),
    fork(mangroveDataSagas),
  ]);
};