import { takeLatest, put, select } from 'redux-saga/effects';
import { setCurrent } from 'modules/locations/actions';
import { closeInfoPanel, resetUi } from 'modules/widgets/actions';

export const getCurrentLocation = (locationsList, currentId, locationType) => locationsList?.find(({
  id, iso, location_type,
}) => (id === currentId
  || iso.toLowerCase() === currentId.toLowerCase())
  && location_type.toLowerCase() === locationType.toLowerCase());

/**
  * Set current location
  */
function* setLocation({ payload }) {
  const { iso, id } = payload;
  const targetLocation = iso || id || 'worldwide';
  const idKey = iso ? 'iso' : 'id';
  const { locations: { current } } = yield select();

   if ((!current || current[idKey] !== targetLocation) && id !== 'worldwide') {
    yield put(setCurrent({ [idKey]: targetLocation }));
    yield put(resetUi());
  }

  // In case user sets location from widget modal

  if (current) {
    if (current.iso !== 'custom-area' && (current.iso !== targetLocation.toLowerCase()
    || current.id !== targetLocation.toLowerCase())) {
      yield put(closeInfoPanel());
    }
  }
}

export default function* pages() {
  yield takeLatest('PAGE/APP', setLocation);
  yield takeLatest('PAGE/CUSTOM', setLocation);
  yield takeLatest('PAGE/COUNTRY', setLocation);
  yield takeLatest('PAGE/WDPA', setLocation);
}
