import { takeLatest, put, select } from 'redux-saga/effects';
import { setCurrent, closeSearchPanel } from 'modules/locations/actions';
import { closeInfoPanel, resetUi } from 'modules/widgets/actions';

export const getLocationType = (type) => {
  if (type === 'PAGE/APP') return 'worldwide';
  if (type === 'PAGE/CUSTOM') return 'custom-area';
  if (type === 'PAGE/COUNTRY') return 'country';
  if (type === 'PAGE/WDPA') return 'protected-area';
  return 'worldwide';
};

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
  // const { locations, router: { type } } = yield select();
  // const locationType = getLocationType(type);
  // const currentLocationIsos = locations.list.filter((location) => location.iso === iso
  //   || id === location.id
  //   || location.location_id === id);
  // const currentLocationId = currentLocationIsos.length === 1
  //   ? currentLocationIsos[0].id
  //   : currentLocationIsos?.find((location) => location.location_type === locationType)?.id;

  // if (currentLocation?.id === 'custom-area') {
  //   yield put(setCurrentId(
  //     { ...currentLocation && { id: currentLocation } },
  //   ));
  // }

   if ((!current || current[idKey] !== targetLocation) && id !== 'worldwide') {
    yield put(setCurrent({ [idKey]: targetLocation }));
    yield put(resetUi());
  }

  // In case user sets location from widget modal
  if (current) {
    if ((current.iso && current.iso !== targetLocation.toLowerCase())
      || (current.id && current.id !== targetLocation.toLowerCase())) {
      yield put(closeSearchPanel());
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
