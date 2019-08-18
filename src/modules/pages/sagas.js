import { takeLatest, put } from 'redux-saga/effects';
import { setCurrent, closeSearchPanel } from 'modules/locations/actions';

function* setLocation({ payload }) {
  /**
   * Set current location
   */
  if (payload.id || payload.iso) {
    yield put(setCurrent({ ...payload }));
  } else {
    yield put(setCurrent({ id: 'worldwide' }));
  }

  yield put(closeSearchPanel());
}

export default function* pages() {
  yield takeLatest('PAGE/APP', setLocation);
  yield takeLatest('PAGE/COUNTRY', setLocation);
  yield takeLatest('PAGE/AOI', setLocation);
  yield takeLatest('PAGE/WDPA', setLocation);
}
