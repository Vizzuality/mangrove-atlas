import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveSpeciesData({ payload }) {
<<<<<<< HEAD
  const { id } = payload;

  yield put(fetchRequested());
  try {
    const mangroveSpeciesData = yield call(service.fetchMangroveSpeciesData, { location_id: id });
=======
  yield put(fetchRequested());
  try {
    const mangroveSpeciesData = yield call(service.fetchMangroveSpeciesData, payload);
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

    yield put(fetchSucceeded(mangroveSpeciesData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveSpeciesDataSagas() {
<<<<<<< HEAD
  yield takeLatest('LOCATIONS/SET_CURRENT_ID', getMangroveSpeciesData);
=======
  yield takeLatest('MANGROVE_SPECIES_DATA/FETCH_ALL', getMangroveSpeciesData);
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
}
