import { takeLatest, put, select } from 'redux-saga/effects';
import { FlyToInterpolator } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import bbox from '@turf/bbox';
import { currentLocation } from 'modules/locations/selectors';
import { easeCubic } from 'd3-ease';
import { resetViewport, setViewport, setBasemap } from './actions';

function* flyToCurrentLocation() {
  const state = yield select();
  const location = currentLocation(state);

  if (location) {
    if (location.type === 'global') {
      yield put(resetViewport());
    } else {
      const bounds = bbox(location.geometry);
      const { longitude, latitude, zoom } = new WebMercatorViewport(state.map.viewport)
        .fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], {
          padding: { top: 50, bottom: 50, right: 20, left: 620 }
        });

      const viewport = {
        ...state.map.viewport,
        longitude,
        latitude,
        zoom,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: easeCubic
      };
      yield put(setViewport(viewport));
    }
  }
}

// Part of query state, not normal flow.
// View ./index.js queryState.add for more info.
export function * restoreState() {
  /**
   * A regular selector, it could be on a selectors file with reselect
   * or better yet, be created automatically by the package based on registered namespace info.
  */
  const basemapSelector = state => state.router.query.map.basemap;
  const basemap = yield select(basemapSelector);

  yield(put(setBasemap(basemap)));
}

export default function* pages() {
  yield takeLatest('LOCATIONS/FETCH_SUCCEDED', flyToCurrentLocation);
  yield takeLatest('LOCATIONS/SET_CURRENT', flyToCurrentLocation);
}
