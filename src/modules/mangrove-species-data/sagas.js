import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveSpeciesData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveSpeciesData = yield call(service.fetchMangroveSpeciesData, payload);
    yield put(fetchSucceeded(mangroveSpeciesData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveDataSagas() {
  yield takeLatest('LOCATIONS/SET_CURRENT', getMangroveSpeciesData);
}
