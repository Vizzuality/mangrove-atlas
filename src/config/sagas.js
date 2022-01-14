import { all, fork } from 'redux-saga/effects';

import queryState from 'utils/query-state';

import app from 'modules/app/sagas';
import pages from 'modules/pages/sagas';
import map from 'modules/map/sagas';
import mapStyles from 'modules/map-styles/sagas';
import layers from 'modules/layers/sagas';
import widgets from 'modules/widgets/sagas';
import locations from 'modules/locations/sagas';
import dashboards from 'modules/dashboards/sagas';
import languages from 'modules/languages/sagas';
import mangroveData from 'modules/mangrove-data/sagas';
import mangroveSpeciesData from 'modules/mangrove-species-data/sagas';
import ranking from 'modules/ranking/sagas';
import alerts from 'modules/alerts/sagas';

export default function* root() {
  yield all([
    fork(queryState.sagas.bind(queryState)),
    fork(app),
    fork(pages),
    fork(map),
    fork(mapStyles),
    fork(layers),
    fork(widgets),
    fork(locations),
    fork(dashboards),
    fork(languages),
    fork(mangroveData),
    fork(mangroveSpeciesData),
    fork(ranking),
    fork(alerts)
  ]);
}
