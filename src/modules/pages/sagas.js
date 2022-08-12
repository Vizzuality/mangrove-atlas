import { takeLatest, put, select } from 'redux-saga/effects';
import { setCurrent, setCurrentId, closeSearchPanel } from 'modules/locations/actions';
import { closeInfoPanel, resetUi } from 'modules/widgets/actions';

export const getLocationType = (type) => {
  if (type === 'PAGE/APP') return 'worldwide';
  if (type === 'PAGE/COUNTRY') return 'country';
  if (type === 'PAGE/AOI') return 'area-of-interest';
  if (type === 'PAGE/WDPA') return 'protected-area';
  return 'worldwide';
};

export const getCurrentLocation = (locationsList, currentId, locationType) => locationsList?.find(({
  id, iso, location_type,
}) => (id === currentId
  || iso.toLowerCase() === currentId.toLowerCase())
  && location_type.toLowerCase() === locationType.toLowerCase());

export const getDataByWidget = (data) => {
  const netChange = !!data.filter((d) => !!d?.gain_m2 || !!d?.loss_m2);
  const blueCarbon = !!data.filter((d) => !!d.toc_hist_tco2eha);

  const widgetsData = {
    mangrove_net_change: netChange,
    mangrove_blue_carbon: blueCarbon,
  };

  return   Object.keys(widgetsData)
  .reduce((o, key) => {
    !widgetsData[key] && (o[key] = widgetsData[key]);
    return o;
  }, []);
};


/**
  * Set current location
  */
function* setLocation({ payload }) {
  const { iso, id } = payload;
  const targetLocation = iso || id || 'worldwide';
  const idKey = iso ? 'iso' : 'id';
  const { locations: { current } } = yield select();
  const { locations, router: { type } } = yield select();

  const locationType = getLocationType(type);
  const currentLocationIsos = locations.list.filter((location) => location.iso === iso
    || id === location.id
    || location.location_id === id);
  const currentLocationId = currentLocationIsos.length === 1
    ? currentLocationIsos[0].id
    : currentLocationIsos?.find((location) => location.location_type === locationType)?.id;

  if (currentLocationId) {
    yield put(setCurrentId(
      { ...currentLocationId && { location_id: currentLocationId } },
    ));
  }

  if (!current || current[idKey] !== targetLocation) {
    yield put(setCurrent({ [idKey]: targetLocation }));
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
