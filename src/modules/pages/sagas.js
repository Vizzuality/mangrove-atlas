import { takeLatest, put, select } from 'redux-saga/effects';
import { setCurrent, setCurrentId, closeSearchPanel } from 'modules/locations/actions';
import { closeInfoPanel, resetUi } from 'modules/widgets/actions';

/**
  * Set current location
  */
function* setLocation({ payload: { iso, id } }) {
  const targetLocation = iso || id || 'worldwide';
  const idKey = iso ? 'iso' : 'id';
  const { locations: { current } } = yield select();

  if (!current || current[idKey] !== targetLocation) {
    yield put(setCurrent({ [idKey]: targetLocation }));
    yield put(setCurrentId({ id }));
    yield put(resetUi());
  }

  // In case user sets location from widget modal
  if (current) {
    if ((current.iso && current.iso !== targetLocation)
      || (current.id && current.id !== targetLocation)) {
      yield put(closeSearchPanel());
      yield put(closeInfoPanel());
    }
  }
}

export default function* pages() {
  yield takeLatest('PAGE/APP', setLocation);
  yield takeLatest('PAGE/COUNTRY', setLocation);
  yield takeLatest('PAGE/AOI', setLocation);
  yield takeLatest('PAGE/WDPA', setLocation);
}
