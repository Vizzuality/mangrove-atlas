import { takeLatest, put } from 'redux-saga/effects';
import { FlyToInterpolator } from 'react-map-gl';
// import bbox from '@turf/bbox';
import { setViewport } from './actions';

// console.log(bbox)

function* flyToCurrentLocation() {
  // const {  }

  yield put(setViewport({
    // longitude: -74.1,
    // latitude: 40.7,
    // zoom: 14,
    transitionInterpolator: new FlyToInterpolator()
  }));
}

export default function* pages() {
  yield takeLatest('PAGE/APP', flyToCurrentLocation);
  yield takeLatest('PAGE/COUNTRY', flyToCurrentLocation);
  yield takeLatest('PAGE/AOI', flyToCurrentLocation);
  yield takeLatest('PAGE/WDPA', flyToCurrentLocation);
}
