import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveBiomassData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveBiomassData = yield call(service.fetchMangroveBiomassData, payload);
    yield put(fetchSucceeded(mangroveBiomassData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveBiomassDataSagas() {
  yield takeLatest('MANGROVE_BIOMASS_DATA/FETCH_ALL', getMangroveBiomassData);
}
