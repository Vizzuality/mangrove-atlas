import { takeLatest, put, select } from 'redux-saga/effects';
import { FlyToInterpolator } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import bbox from '@turf/bbox';
import { currentLocation } from 'modules/locations/selectors';
import { easeCubic } from 'd3-ease';
import { resetViewport, setViewport } from './actions';

function* flyToCurrentLocation() {
  const state = yield select();
  const location = currentLocation(state);

  if (location) {
    if (location.type === 'global') {
      yield put(resetViewport());
    } else {
      const bounds = bbox(location.geometry);
      const { longitude, latitude, zoom } = new WebMercatorViewport(state.map.viewport)
        .fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]]);

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

export default function* pages() {
  yield takeLatest('LOCATIONS/FETCH_SUCCEDED', flyToCurrentLocation);
  yield takeLatest('LOCATIONS/SET_CURRENT', flyToCurrentLocation);
}
