import { takeLatest, put, select } from 'redux-saga/effects';

import { setMapViewport } from './actions';
// todo: this should come from a service
const viewports = {
  rufiki: {
    latitude: -7.91275571091764,
    longitude: 39.30500267715895,
    zoom: 8.473400089413548,
    bearing: -90.46923879040666,
    pitch: 58.88205746800766,
    altitude: 1.5
  },
  saloum: {
    latitude: 13.965552323345662,
    longitude: -16.52763952454814,
    zoom: 9.425411817490362,
    bearing: 51.05318039624609,
    pitch: 57.17186575990538,
    altitude: 1.5
  }
};

function viewportChanged(currentViewport, newViewport) {
  const propsToCompare = ['zoom', 'latitude', 'longitude'];
  let result = false;

  propsToCompare.forEach(prop => {
    const currentProp = currentViewport[prop];
    const newProp = newViewport[prop];

    if (newProp && !currentProp) {
      result = true;
    }

    if (newProp !== currentProp) {
      result = true;
    }
  });

  return result;
}

function* setLocation({ payload: {type, id}}) {
  const state = yield select();
  const { viewport: currentViewport } = state.map;
  let newViewport = {
    zoom: 2,
    latitude: 20,
    longitude: 0
  };

  if (type === 'aoi') {
    const viewport = viewports[id];
    
    if (viewport) {
      newViewport = viewport;
    } 
  }

  if (viewportChanged(currentViewport, newViewport)) {
    yield put(setMapViewport(newViewport));
  }
}

export default function* map() {
  yield takeLatest('LOCATION', setLocation);
}
