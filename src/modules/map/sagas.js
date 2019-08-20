import { takeLatest, put, select } from 'redux-saga/effects';
import bboxTurf from '@turf/bbox';
import { currentLocation } from 'modules/locations/selectors';
import { resetViewport, setBounds, setBasemap } from './actions';

function* flyToCurrentLocation() {
  const state = yield select();
  const location = currentLocation(state);
  const { mapView } = state.app.mobile;

  if (location) {
    if (location.location_type === 'worldwide') {
      yield put(resetViewport());
    } else {
      const bbox = bboxTurf(location.bounds);

      yield put(setBounds({
        bbox,
        options: {
          padding: { top: 50, bottom: 50, right: 20, left: mapView ? 20 : 620 }
        }
      }));
    }
  }
}

// Part of query state, not normal flow.
// View ./index.js queryState.add for more info.
export function* restoreMapState() {
  /**
   * A regular selector, it could be on a selectors file with reselect
   * or better yet, be created automatically by the package based on registered namespace info.
  */
  const basemapSelector = state => (state.router.query
    && state.router.query.map
    && state.router.query.map.basemap) || null;
  const basemap = yield select(basemapSelector);
  if (basemap) {
    yield put(setBasemap(basemap));
  }
}

export default function* pages() {
  yield takeLatest('LOCATIONS/FETCH_SUCCEDED', flyToCurrentLocation);
  yield takeLatest('LOCATIONS/SET_CURRENT', flyToCurrentLocation);
  yield takeLatest('APP/MOBILE', flyToCurrentLocation);
}
