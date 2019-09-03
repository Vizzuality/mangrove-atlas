import { takeLatest, put, select } from 'redux-saga/effects';
import { setCurrent, closeSearchPanel } from 'modules/locations/actions';
import { closeInfoPanel } from 'modules/widgets/actions';

/**
  * Set current location
  */
function* setLocation({ payload: { iso, id } }) {
  const targetLocation = iso || id || 'worldwide';
  const idKey = iso ? 'iso' : 'id';
  const { locations: { current } } = yield select();

  if (!current || current[idKey] !== targetLocation) {
    yield put(setCurrent({ [idKey]: targetLocation }));
  }

  yield put(closeSearchPanel());
  // In case user sets location from widget modal
  yield put(closeInfoPanel());
}

export default function* pages() {
  yield takeLatest('PAGE/APP', setLocation);
  yield takeLatest('PAGE/COUNTRY', setLocation);
  yield takeLatest('PAGE/AOI', setLocation);
  yield takeLatest('PAGE/WDPA', setLocation);
}
