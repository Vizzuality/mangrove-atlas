import { all, fork } from 'redux-saga/effects';

import queryState from 'utils/query-state';

import * as pages from 'modules/pages';
import * as map from 'modules/map';
import * as mapStyles from 'modules/map-styles';
import * as layers from 'modules/layers';
import * as widgets from 'modules/widgets';
import * as locations from 'modules/locations';
import * as dashboards from 'modules/dashboards';

export default function* root() {
  yield all([
    fork(queryState.sagas.bind(queryState)),
    fork(pages.sagas),
    fork(map.sagas),
    fork(mapStyles.sagas),
    fork(layers.sagas),
    fork(widgets.sagas),
    fork(locations.sagas),
    fork(dashboards.sagas)
  ]);
};